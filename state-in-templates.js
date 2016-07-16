import {ReactiveDict} from 'meteor/reactive-dict';
import {ReactiveVar} from 'meteor/reactive-var';
import {Template} from 'meteor/templating';
import {Tracker} from 'meteor/tracker';
import {_} from 'meteor/underscore';

export default function addStateToTemplate (template) {
    template.onCreated(function () {
        const reactiveState = new ReactiveVar();

        Object.defineProperty(this, 'state', {
            get: reactiveState.get.bind(reactiveState),
            set: reactiveState.set.bind(reactiveState)
        });
        let _shouldTemplateUpdate;
        this.shouldTemplateUpdate = fn => {
            if (typeof fn === 'function') {
                _shouldTemplateUpdate = fn;
            } else {
                console.warn('Expected function in `shouldTemplateUpdate` but got:', typeof fn);
            }
        };
        const attachNewState = state => {
            state = state || {};
            if (state._shareState instanceof ReactiveDict) {
                reactiveState.set(state._shareState);
                return true;
            } else if (state instanceof ReactiveDict) {
                reactiveState.set(state);
                return true;
            }
        };
        const view = Blaze.getView('with', this.view);
        if (view && view.dataVar) {
            if (!this.state && !attachNewState(view.dataVar.curValue._state)) {
                attachNewState(new ReactiveDict());
            }
            view.dataVar.equalsFunc = (oldData, data) => {
                oldData = typeof oldData === 'object' ? (oldData || {}) : {};
                if (data && attachNewState(data._state)) {
                    delete data._state;
                    if (!Object.keys(data).length){
                        return true;
                    }
                }
                if (_shouldTemplateUpdate && _shouldTemplateUpdate(oldData, data) === false) {
                    return true;
                }
                const keys = _.union(Object.keys(data), Object.keys(oldData));
                return keys.every(key => oldData[key] === data[key]);
            };
        } else {
            //Fallback
            this.autorun(() => {
                const {_state} = Template.currentData();
                if (_state && attachNewState(_state)) {
                    return;
                }

                if (!this.state) {
                    attachNewState(new ReactiveDict());
                }
            });
        }
    });

    template.helpers({
        _state (what) {
            const state = Template.instance().state;
            if (typeof what === 'string') {
                return state && state.get(what);
            }
            return Object.assign(Object.create({_shareState: state}), (state && state.all() || {}));
        },
        _shareState () {
            return Template.instance().state;
        }
    });
}
