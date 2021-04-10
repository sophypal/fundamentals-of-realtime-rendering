import { modifier } from 'ember-modifier';
import renderMathInElement from 'katex/contrib/auto-render/auto-render';

export default modifier((element, [markup]) => {
    const content = markup ? `\\(${markup}\\)` : element.innerHTML;

    const spaces = content.replace(/\n*/, '').match(/^\s+/g) || '';
    // Replace the number of first line spaces on all lines following.
    const spacesRegExp = spaces ? new RegExp('^' + spaces, 'gm') : '';
    const formattedContent = content
        .replace(spacesRegExp, '')
        .replace(/^\s+|\s+$/g, '');
    element.innerHTML = formattedContent;
    renderMathInElement(element);
});
