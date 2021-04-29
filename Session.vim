let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Documents/ReactNative/SQL-Playground
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +56 ~/Documents/ReactNative/SQL-Playground/src/component/InputContainer.tsx
badd +134 ~/Documents/ReactNative/SQL-Playground/src/component/SearchBox.tsx
badd +26 ~/Documents/ReactNative/SQL-Playground/src/component/CustomHandle.tsx
badd +147 ~/Documents/ReactNative/SQL-Playground/src/component/CommandList.tsx
badd +17 ~/Documents/ReactNative/SQL-Playground/src/component/RunButton.tsx
argglobal
%argdel
edit ~/Documents/ReactNative/SQL-Playground/src/component/RunButton.tsx
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 40 + 86) / 173)
exe 'vert 2resize ' . ((&columns * 132 + 86) / 173)
argglobal
enew
file \[coc-explorer]-1
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal nofen
wincmd w
argglobal
balt ~/Documents/ReactNative/SQL-Playground/src/component/CommandList.tsx
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 20 - ((13 * winheight(0) + 17) / 34)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 20
normal! 042|
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 40 + 86) / 173)
exe 'vert 2resize ' . ((&columns * 132 + 86) / 173)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0&& getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOFAcI
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
