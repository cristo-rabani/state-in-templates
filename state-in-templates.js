import {ReactiveDict} from 'meteor/reactive-dict';
import {ReactiveVar} from 'meteor/reactive-var';
import {Template} from 'meteor/templating';
import {_} from 'meteor/underscore';

export default function addStateToTemplate (template) {
    template.onCreated(function () {
        const reactiveState = new ReactiveVar();

        Object.defineProperty(this, 'state', {
            get: reactiveState.get.bind(reactiveState),
            set: reactiveState.set.bind(reactiveState)
        });

        const attachNewState = state => {
            if (state._shareState instanceof ReactiveDict) {
                reactiveState.set(state._shareState);
                return true;
            } else if (state instanceof ReactiveDict) {
                reactiveState.set(state);
                return true;
            }
        };
        // better way:
        const view = Blaze.getView('with');
        if (view && view.dataVar) {
            view.dataVar.equalsFunc = (oldData, data) => {
                oldData = typeof oldData === 'object' ? (oldData || {}) : {};
                if (data && data._state && attachNewState(data._state)) {
                    delete data._state;
                    delete oldData._state;
                }
                const keys = _.union(Object.keys(data), Object.keys(oldData));
                return !(keys.some(key => oldData[key] !== data[key]));
            };
        }
        // fallback:
        this.autorun(() => {
            const {_state} = Template.currentData();
            if (_state && attachNewState(_state)) {
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
            return Object.assign(Object.create({_shareState: state}), (state && state.all() || {}));
        }
    });
}
