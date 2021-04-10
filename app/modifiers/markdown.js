import { modifier } from 'ember-modifier';
import prism from 'prism';
import marked from 'marked';

export default modifier((element) => {
    // Fix indentation from the HTML source.
    const content = element.innerHTML;
    // Decode the entities so that markdown doesn't get messed up.
    // Ember.$('<div/>').html(content).text() - doesn't work as it removes any HTML that is embedded.
    // Replace ">" to get the quotes back...
    const decodedContent = content.replace(/&gt;/gm, '>').replace(/&lt;/gm, '<');
    // Get the first line's spaces and replace an initial new line.
    const spaces = decodedContent.replace(/\n*/, '').match(/^\s+/g);
    // Replace the number of first line spaces on all lines following.
    const spacesRegExp = new RegExp('^' + spaces, 'gm');
    let formattedContent = decodedContent
        .replace(spacesRegExp, '')
        .replace(/^\s+|\s+$/g, '');
    formattedContent = marked(formattedContent);

    element.innerHTML = formattedContent;

    prism.highlightAllUnder(element);
});
