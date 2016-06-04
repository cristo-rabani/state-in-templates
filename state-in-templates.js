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
            if (_state) {
                if (_state._shareState instanceof ReactiveDict) {
                    this.state = _state._shareState;
                    return;
                } else if (_state instanceof ReactiveDict) {
                    this.state = _state;
                    return;
                }
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
            return Object.assign(Object.create({_shareState: state}), (state && state.all() || {}));
        }
    });
}
