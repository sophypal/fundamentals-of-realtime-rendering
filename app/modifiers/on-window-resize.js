import { modifier } from 'ember-modifier';

export default modifier((element, [callback]) => {
    function handleEvent (evt) {
        callback(element, evt)
    }

    window.addEventListener('resize', handleEvent) 

    return () => {
        window.removeEventListener('resize', handleEvent)
    }
});
