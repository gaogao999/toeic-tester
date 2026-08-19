#!/usr/bin/env python3
"""
PDF を文字にする。

**スキャン画像の PDF と、文字が入っている PDF はやることが全く違う。**
文字が入っていれば取り出すだけ（無料・一瞬・誤字ゼロ）。
スキャン画像なら OCR がいる（時間もかかるし誤字も出る）。
だから最初に必ず判別する。

    python3 tools/pdf-to-text.py 教材.pdf --check           判別だけ（まずこれ）
    python3 tools/pdf-to-text.py 教材.pdf                   自動で判別して書き出す
    python3 tools/pdf-to-text.py 教材.pdf --mode images     ページを画像にする
    python3 tools/pdf-to-text.py 教材.pdf --mode ocr        OCR にかける
    python3 tools/pdf-to-text.py 教材.pdf --pages 1-20      範囲を絞る

必要なもの:
    pip install pymupdf pillow
    apt-get install tesseract-ocr tesseract-ocr-jpn    （OCR を使うときだけ）

出力は out/<PDFの名前>/ の下に、ページごとに分けて置く。
1ファイルにまとめないのは、**あとで「この本文は何ページ目から来たか」を追えるようにする**ため。
教材を取り込んだあとに誤字を見つけたとき、元のページに戻れないと直しようがない。
"""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

try:
    import pymupdf
except ImportError:
    sys.exit('pymupdf が要ります。  pip install pymupdf')


# 文字が入っているページと判定する文字数の下限。
# 表紙や中扉はもともと文字が少ないので、これ未満でも「スキャン」とは限らない
TEXT_MIN_CHARS = 100


def parse_pages(spec, total):
    """'1-20' や '3' や '5-' を 0 始まりのページ番号の一覧にする"""
    if not spec:
        return list(range(total))
    out = []
    for part in spec.split(','):
        part = part.strip()
        if '-' in part:
            a, _, b = part.partition('-')
            start = int(a) if a else 1
            end = int(b) if b else total
        else:
            start = end = int(part)
        out.extend(range(start - 1, min(end, total)))
    return sorted(set(p for p in out if 0 <= p < total))


def page_kind(page):
    """そのページが「文字入り」か「スキャン画像」かを見る"""
    n = len(page.get_text().strip())
    if n >= TEXT_MIN_CHARS:
        return 'text'
    if n > 0:
        return 'thin'   # ノンブルだけ、など。図版ページの可能性が高い
    return 'scan'


def inspect(doc, pages):
    """判別の結果をまとめる"""
    kinds = {}
    for i in pages:
        k = page_kind(doc[i])
        kinds.setdefault(k, []).append(i + 1)
    return kinds


def cmd_check(doc, pages, path):
    kinds = inspect(doc, pages)
    print(f'{path.name}: 全 {doc.page_count} ページ（うち {len(pages)} ページを確認）')
    for k, label in [('text', '文字が入っている'), ('thin', '文字がわずか（図版ページ？）'), ('scan', 'スキャン画像')]:
        n = len(kinds.get(k, []))
        if n:
            sample = ', '.join(map(str, kinds[k][:8]))
            more = ' …' if n > 8 else ''
            print(f'  {label}: {n} ページ  （p{sample}{more}）')

    scan = len(kinds.get('scan', [])) + len(kinds.get('thin', []))
    if scan > len(pages) / 2:
        print('\n→ **スキャン画像の PDF** です。OCR が要ります。')
        print('   おすすめ: --mode images でページを画像にして、精度の高い OCR に渡す')
        print('   手軽に済ませるなら: --mode ocr（tesseract。英語は実用、日本語は落ちる）')
    else:
        print('\n→ **文字が入っている PDF** です。OCR は要りません。')
        print('   そのまま実行すれば取り出せます（誤字ゼロ・一瞬）。')

    # 最初の文字入りページの冒頭を見せる。判別が合っているか目で確かめられるように
    first = next((i for i in pages if page_kind(doc[i]) == 'text'), None)
    if first is not None:
        head = ' '.join(doc[first].get_text().split())[:200]
        print(f'\n  p{first + 1} の冒頭: {head}…')


def cmd_text(doc, pages, outdir):
    """文字を取り出す。段組みを保ちたいので sort=True（読む順に並べ替える）"""
    outdir.mkdir(parents=True, exist_ok=True)
    written = 0
    for i in pages:
        text = doc[i].get_text('text', sort=True).strip()
        if not text:
            continue
        (outdir / f'p{i + 1:04d}.txt').write_text(text, encoding='utf-8')
        written += 1
    joined = '\n\n'.join(
        f'===== p{i + 1} =====\n' + doc[i].get_text('text', sort=True).strip()
        for i in pages if doc[i].get_text().strip()
    )
    (outdir / 'all.txt').write_text(joined, encoding='utf-8')
    print(f'{written} ページを書き出しました → {outdir}/')
    print(f'  ページごと: p0001.txt …   / まとめ: all.txt')


def cmd_images(doc, pages, outdir, dpi, fmt):
    """ページを画像にする。OCR に渡す前段、または人が読む用"""
    outdir.mkdir(parents=True, exist_ok=True)
    total = 0
    for i in pages:
        pix = doc[i].get_pixmap(dpi=dpi)
        p = outdir / f'p{i + 1:04d}.{fmt}'
        pix.save(p)
        total += p.stat().st_size
    n = len(pages)
    print(f'{n} ページを画像にしました → {outdir}/  （{dpi}dpi, 合計 {total / 1e6:.1f} MB, 平均 {total / n / 1e3:.0f} KB/ページ）')
    if total > 20e6:
        print('  ⚠ まとめて送るには大きいので、--pages で分けるか --dpi を下げてください')


def cmd_ocr(doc, pages, outdir, dpi, lang):
    """tesseract にかける。300dpi・グレースケールが一番精度が出る"""
    if not shutil.which('tesseract'):
        sys.exit('tesseract がありません。  apt-get install tesseract-ocr tesseract-ocr-jpn')
    outdir.mkdir(parents=True, exist_ok=True)
    tmp = outdir / '_tmp.png'
    chunks = []
    for n, i in enumerate(pages, 1):
        # OCR は色情報を使わない。グレースケールにすると速くて精度も落ちない
        pix = doc[i].get_pixmap(dpi=dpi, colorspace=pymupdf.csGRAY)
        pix.save(tmp)
        r = subprocess.run(['tesseract', str(tmp), 'stdout', '-l', lang, '--psm', '3'],
                           capture_output=True, text=True)
        if r.returncode != 0:
            print(f'  p{i + 1}: tesseract が失敗 — {r.stderr.strip()[:120]}', file=sys.stderr)
            continue
        text = r.stdout.strip()
        (outdir / f'p{i + 1:04d}.txt').write_text(text, encoding='utf-8')
        chunks.append(f'===== p{i + 1} =====\n{text}')
        print(f'\r  OCR {n}/{len(pages)} ページ', end='', flush=True)
    print()
    tmp.unlink(missing_ok=True)
    (outdir / 'all.txt').write_text('\n\n'.join(chunks), encoding='utf-8')
    print(f'{len(chunks)} ページを OCR しました → {outdir}/')
    print('  ⚠ OCR の結果は必ず目で確かめてください。数字・記号・固有名詞をよく間違えます。')


def main():
    ap = argparse.ArgumentParser(description='PDF を文字にする')
    ap.add_argument('pdf', type=Path)
    ap.add_argument('--mode', choices=['auto', 'text', 'images', 'ocr'], default='auto')
    ap.add_argument('--check', action='store_true', help='判別だけして何も書き出さない')
    ap.add_argument('--pages', help="範囲。'1-20' '3' '5-' '1-3,7'")
    ap.add_argument('--dpi', type=int, default=0, help='画像の解像度。既定は画像 200 / OCR 300')
    ap.add_argument('--format', default='png', choices=['png', 'jpg'])
    ap.add_argument('--lang', default='eng', help="OCR の言語。'eng' 'jpn' 'eng+jpn'")
    ap.add_argument('--out', type=Path, help='書き出し先。既定は out/<PDFの名前>/')
    args = ap.parse_args()

    if not args.pdf.exists():
        sys.exit(f'ファイルがありません: {args.pdf}')

    doc = pymupdf.open(args.pdf)
    pages = parse_pages(args.pages, doc.page_count)
    if not pages:
        sys.exit('その範囲にページがありません')

    if args.check:
        cmd_check(doc, pages, args.pdf)
        return

    outdir = args.out or Path('out') / args.pdf.stem

    mode = args.mode
    if mode == 'auto':
        kinds = inspect(doc, pages)
        scan = len(kinds.get('scan', [])) + len(kinds.get('thin', []))
        mode = 'images' if scan > len(pages) / 2 else 'text'
        print(f'自動判別 → {"スキャン画像なので画像に書き出します" if mode == "images" else "文字が入っているので取り出します"}\n')

    if mode == 'text':
        cmd_text(doc, pages, outdir)
    elif mode == 'images':
        cmd_images(doc, pages, outdir, args.dpi or 200, args.format)
    elif mode == 'ocr':
        cmd_ocr(doc, pages, outdir, args.dpi or 300, args.lang)


if __name__ == '__main__':
    main()
