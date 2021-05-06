import * as sapper from '@sapper/app';

const target = document.querySelector('#sapper');
if (!target) throw new Error("Missing #sapper element");
sapper.start({ target });
