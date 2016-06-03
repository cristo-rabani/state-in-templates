import {ReactiveDict} from 'meteor/reactive-dict';
import {ReactiveVar} from 'meteor/reactive-var';
import {Template} from 'meteor/templating';

export default function addStateToTemplate (template) {
    template.onCreated(function () {
        const reactiveState = new ReactiveVar();
        Object.defineProperty(this, 'state', {
            get: reactiveState.get.bind(reactiveState),
            set: reactiveState.set.bind(reactiveState)

        });
        this.autorun(() => {
            const {_state} = Template.currentData();
            if (_state && (_state._state instanceof ReactiveDict)) {
                this.state = _state._state;
                return;
            }
            if (!this.state) {
                this.state = new ReactiveDict();
            }
        });
    });
    template.helpers({
        _state (what) {
            const state = Template.instance().state;
            if (typeof what === 'string') {
                return state && state.get(what);
            }

            const arr = state && state.all() || {};
            arr._state = state;
            return arr;

        }
    });
}
