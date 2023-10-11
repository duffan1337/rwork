// Calendar Localization (temp)

var Language = function (t, e, s, o) {
    this.language = t, this.months = e, this.monthsAbbr = s, this.days = o, this.rtl = !1, this.ymd = !1, this.yearSuffix = ""
}, prototypeAccessors = {
    language: { configurable: !0 },
    months: { configurable: !0 },
    monthsAbbr: { configurable: !0 },
    days: { configurable: !0 }
};
prototypeAccessors.language.get = function () {
    return this._language
}, prototypeAccessors.language.set = function (t) {
    if ("string" != typeof t) throw new TypeError("Language must be a string");
    this._language = t
}, prototypeAccessors.months.get = function () {
    return this._months
}, prototypeAccessors.months.set = function (t) {
    if (12 !== t.length) throw new RangeError("There must be 12 months for " + this.language + " language");
    this._months = t
}, prototypeAccessors.monthsAbbr.get = function () {
    return this._monthsAbbr
}, prototypeAccessors.monthsAbbr.set = function (t) {
    if (12 !== t.length) throw new RangeError("There must be 12 abbreviated months for " + this.language + " language");
    this._monthsAbbr = t
}, prototypeAccessors.days.get = function () {
    return this._days
}, prototypeAccessors.days.set = function (t) {
    if (7 !== t.length) throw new RangeError("There must be 7 days for " + this.language + " language");
    this._days = t
}, Object.defineProperties(Language.prototype, prototypeAccessors);
var ru = new Language("Russian", ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"], ["Янв", "Февр", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек"], ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]);

// Main JS

const Vuex = require('vuex');
const Vuedals = require('vuedals');
const VueMultiselect = require('vue-multiselect');
const VueTelInput = require('vue-tel-input');
const VueDatepicker = require('vuejs-datepicker');
const Bus = Vuedals.Bus;
const { validationMixin, default: Vuelidate } = require('vuelidate');
const { required, minValue, minLength, maxLength, email, helpers } = require('vuelidate/lib/validators');

const TOMORROW_DATE = new Date().setDate((new Date()).getDate());
const
    MAX_FILES_COUNT = 3,
    MAX_FILES_SIZE = 200;

const maxFileSize = (param) =>
    (value) => {
        let totalFileSize = 0;

        for (let i = 0; i < value.length; i++) {
            totalFileSize += value[i].size / 1000000;
        }

        return !helpers.req(value) || totalFileSize < param;
    };

const validPhone = (param) =>
    (value) => {
        return !helpers.req(value) || param;
    };

const validDate = (value) => {
    return !helpers.req(value) || !!Date.parse(value);
};

Vue.use(Vuex);
Vue.use(Vuedals.default);
Vue.use(VueMultiselect.default);
Vue.use(VueTelInput.default);
Vue.use(VueDatepicker);
Vue.use(VTooltip);


Vue.mixin({
    methods: {
        openSumbitModal(data) {
            Bus.$emit('new', {
                name: 'app-modal-form',
                props: data,
                component: 'app-modal-form'
            });
            this.closeModal();
        },
        closeModal() {
            setTimeout(function () {
                Bus.$emit('close');
            }, 4000);
        }
    }
});

let serverFieldErrorsMixin = {
    methods: {
        setErrors(obj) {
            let errCount = Object.keys(obj.error).length;
            if (errCount > 0) {
                for (let i = 0; i < errCount; i++) {
                    for (let key in obj.error) {
                        if (obj.error.hasOwnProperty(key)) {
                            Vue.set(this.submit.errors, key, obj.error[key])
                        }
                    }
                }
            }
        }
    }
};

let loginMixin = {
    data: function () {
        return {
            client: {
                password: '',
                email: ''
            },
            submit: {
                errors: {}
            },
            pending: false
        }
    },
    validations() {
        return {
            client: {
                password: {
                    required
                },
                email: {
                    required,
                    email
                },
            }
        }
    },
    computed: {
        serializeClient() {
            return JSON.stringify({
                'Password': this.client.password,
                'Email': this.client.email
            })
        }
    },
    methods: {
        openRemind() {
            Bus.$emit('remind');
        },
        submitForm() {
            let $this = this;
            $this.pending = true;

            this.$v.client.$touch();
            if (!this.$store.state.isAuth && !this.$v.client.$invalid) {
                this.$store.dispatch({
                    type: 'loginClient',
                    client: this.serializeClient
                })
                    .then((res) => {
                        $this.pending = false;
                        if (res.status === 200) {
                            res.json()
                                .then((data) => {
                                    $this.$store.commit('setUser', data);
                                    /**
                                     * flag buyReadyWork in store is special to buy ready works
                                     * emitted event is catch in main component end then start submit
                                     */
                                    if ($this.$store.state.buyReadyWork) {
                                        Bus.$emit('clientSet');
                                    } else {
                                        window.location.assign('https://client.readywork.ru/profile/');
                                    }
                                })
                                .catch((err) => {
                                    console.error(err)
                                })
                        }
                        if (res.status === 400) {
                            res.json()
                                .then((data) => {
                                    $this.setErrors(data);
                                })
                                .catch((err) => {
                                    console.error(err)
                                })
                        }
                    })
                    .catch((err) => {
                        $this.pending = false;
                        $this.openSumbitModal({
                            message: 'Сервис временно недоступен!',
                            list: {
                                field: 'Текущая ошибка',
                                text: err
                            }
                        });
                        console.error(err);
                    });
            }
        }
    }
};

Vue.component('the-login-client', {
    template: '#the-login-client-template',
    mixins: [validationMixin, loginMixin, serverFieldErrorsMixin],
    delimiters: ['{#', '#}'],
});

Vue.component('the-login-author', {
    template: '#the-login-author-template',
    mixins: [validationMixin, loginMixin, serverFieldErrorsMixin],
    delimiters: ['{#', '#}'],
});

Vue.component('the-registration-client', {
    template: '#the-registration-client-template',
    mixins: [validationMixin, serverFieldErrorsMixin],
    delimiters: ['{#', '#}'],
    data: function () {
        return {
            client: {
                fio: '',
                email: '',
                phone: ''
            },
            submit: {
                errors: {}
            },
            phoneIsValid: false,
            pending: false
        }
    },
    validations() {
        return {
            client: {
                fio: {
                    required,
                    minLength: minLength(1),
                    maxLength: maxLength(80)
                },
                email: {
                    required,
                    email,
                    minLength: minLength(5),
                    maxLength: maxLength(80)
                },
                phone: {
                    required,
                    validPhone: validPhone(this.phoneIsValid)
                },
            },
        }
    },
    methods: {
        onPhoneInput({ isValid }) {
            this.phoneIsValid = isValid;
        },
        submitForm() {
            let $this = this;

            this.$v.client.$touch();

            if (!this.$v.client.$invalid) {
                this.pending = true;
                this.$store.dispatch({
                    type: 'createClient',
                    client: $this.serializeClient
                })
                    .then((res) => {
                        $this.pending = false;
                        if (res.status === 200) {
                            res.json()
                                .then((data) => {
                                    $this.setErrors(data);
                                })
                                .catch((err) => {
                                    console.error(err)
                                })
                        } else if (res.status === 201) {
                            res.json()
                                .then((data) => {
                                    $this.$store.commit('setUser', data);
                                    /**
                                     * flag buyReadyWork in store is special to buy ready works
                                     * emitted event is catch in main component end then start submit
                                     */
                                    if ($this.$store.state.buyReadyWork) {
                                        Bus.$emit('clientSet');
                                    } else {
                                        window.location.assign('https://client.readywork.ru/profile/');
                                    }
                                })
                                .catch((err) => {
                                    console.error(err)
                                })
                        } else {
                            $this.openSumbitModal({
                                message: 'Сервис временно недоступен!',
                                list: {
                                    field: res.status,
                                    text: res.statusText
                                }
                            });
                        }
                    })
                    .catch((err) => {
                        $this.pending = false;
                        $this.openSumbitModal({
                            message: 'Сервис временно недоступен!',
                            list: {
                                field: 'Текущая ошибка',
                                text: err
                            }
                        });
                        console.error(err);
                    });
            }
        }
    },
    computed: {
        serializeClient() {
            return JSON.stringify({
                'fio': this.client.fio,
                'email': this.client.email,
                'phone': this.client.phone
            })
        }
    }
});

Vue.component('the-remind-client', {
    template: '#the-remind-client-template',
    mixins: [validationMixin, serverFieldErrorsMixin],
    delimiters: ['{#', '#}'],
    data: function () {
        return {
            email: '',
            pending: false
        }
    },
    validations() {
        return {
            email: {
                required,
                email,
                minLength: minLength(5),
                maxLength: maxLength(80)
            }
        }
    },
    methods: {
        submitForm() {
            let $this = this;

            this.$v.email.$touch();

            if (!this.$v.email.$invalid) {
                this.pending = true;
                this.$store.dispatch({
                    type: 'remindClient',
                    email: JSON.stringify({ 'email': $this.email })
                })
                    .then((res) => {
                        $this.pending = false;
                        if (res.status === 200) {
                            res.json()
                                .then((data) => {
                                    $this.openSumbitModal({
                                        message: 'На указанный почтовый адрес отправлена ссылка по восстановлению пароля',
                                    });
                                })
                        } else {
                            $this.openSumbitModal({
                                message: 'Сервис временно недоступен!',
                                list: {
                                    field: res.status,
                                    text: res.statusText
                                }
                            });
                        }
                    })
                    .catch((err) => {
                        $this.pending = false;
                        $this.openSumbitModal({
                            message: 'Сервис временно недоступен!',
                            list: {
                                field: 'Текущая ошибка',
                                text: err
                            }
                        });
                        console.error(err);
                    });
            }
        }
    },
    computed: {
        serializeClient() {
            return JSON.stringify({
                'fio': this.client.fio,
                'email': this.client.email,
                'phone': this.client.phone
            })
        }
    }
});

Vue.component('the-registration-author', {
    template: '#the-registration-author-template',
    mixins: [validationMixin],
    data: function () {
        return {
            client: {
                fio: '',
                password: '',
                email: ''
            },
            submit: {
                errors: {},
            }
        }
    },
    validations() {
        return {
            client: {
                fio: {
                    required,
                    minLength: minLength(1),
                    maxLength: maxLength(80)
                },
                password: {
                    required,
                    minLength: minLength(3),
                    maxLength: maxLength(12)
                },
                email: {
                    required,
                    email,
                    minLength: minLength(5),
                    maxLength: maxLength(80)
                },
            }
        }
    },
    computed: {
        serializeClient() {
            return JSON.stringify({
                'fio': this.client.fio,
                'password': this.client.password,
                'email': this.client.email,
            })
        }
    }
});

Vue.component('app-login', {
    template: '#app-login-template',
    props: {
        initialType: String
    },
    delimiters: ['{#', '#}'],
    data: function () {
        return {
            type: this.initialType,
            currentTab: 'the-' + this.initialType + '-client'
        }
    },
    created() {
        Bus.$on('remind', () => {
            this.setType('remind');
        })
    },
    methods: {
        closeModal() {
            this.$emit('vuedals:close');
        },
        setType(type) {
            this.type = type;
            this.currentTab = 'the-' + type + '-client';
        }
    },
    computed: {
        tabs: {
            get: function () {
                return [
                    {
                        component: 'the-' + this.type + '-client',
                        name: 'Клиент',
                        type: this.type,
                    }, {
                        component: 'the-' + this.type + '-author',
                        name: 'Автор',
                        type: this.type,
                    }
                ]
            }
        }
    }
});

const SIDENAV = Vue.component('the-sidenav', {
    template: '#the-sidenav-template',
    delimiters: ['{#', '#}'],
    data: function () {
        return {
            isActive: false,
            mainClass: 'toolbar',
            toolbarScrollClass: 'toolbar_scroll',
            types: [{
                component: 'login',
                name: 'Логин'
            }, {
                component: 'registration',
                name: 'Регистрация',
            }]
        }
    },
    created() {
        Bus.$on('menu', () => {
            this.isActive = !this.isActive;
        });
    },
    methods: {
        openLoginModal(type) {
            Bus.$emit('new', {
                name: 'app-login-modal',
                props: { initialType: type },
                component: 'app-login',
            });
        },
        closeModal() {
            this.$emit('vuedals:close');
        }
    }
});

Vue.component('the-toolbar', {
    template: '#the-toolbar-template',
    delimiters: ['{#', '#}'],
    components: {
        SIDENAV,
    },
    data: function () {
        return {
            isActive: false,
            mainClass: 'toolbar',
            toolbarScrollClass: 'toolbar_scroll',
            types: [{
                component: 'registration',
                name: 'Регистрация',
            }, {
                component: 'login',
                name: 'Логин'
            }]
        }
    },
    methods: {
        openToolbar() {
            this.isActive = !this.isActive
            // Bus.$emit('new', {
            //     name: 'the-sidenav-modal',
            //     component: 'the-sidenav'
            // });
            Bus.$emit('menu');
        },
        openLoginModal(type) {
            Bus.$emit('new', {
                name: 'app-login-modal',
                props: {
                    initialType: type
                },
                component: 'app-login',
            });
        }
    },
});

Vue.component('the-work-tabs', {
    delimiters: ['{#', '#}'],
    template: '#the-work-tabs-template',
    data: function () {
        return {
            currentTab: 'tab-0',
            tabs: [
                {
                    title: 'Выдержка из работы',
                },
                {
                    title: 'Содержание',
                },
                {
                    title: 'Список литературы',
                },
                {
                    title: 'Дополнительно',
                }
            ]
        }
    }
});

let loadDataMixin = {
    data: function () {
        return {
            subjects: [],
            subjectList: [],
            symbols: [],
            url: {
                subjects: '/letters'
            },
            subjectsLoaded: false
        }
    },
    methods: {
        alphabetMake(obj) {
            let $this = obj;
            let alphabet = [];

            for (let prop in $this) {
                if ($this.hasOwnProperty(prop)) {
                    alphabet.push(prop);
                }
            }

            alphabet.sort();

            let symbols = [];
            for (let i = 0; i < alphabet.length; i++) {
                symbols.push({
                    title: alphabet[i]
                });
            }
            return this.symbols = symbols;
        }
    },
    computed: {
        loadSubjects: function () {
            fetch(this.url.subjects)
                .then((res) => {
                    return res.json();
                })
                .then((obj) => {
                    let subjects = obj.items;
                    let subjectList = [];
                    for (let i in subjects) {
                        let k = {};
                        if (subjects.hasOwnProperty(i)) {
                            k = subjects[i];
                        }
                        for (let j in k) {
                            if (k.hasOwnProperty(j)) {
                                subjectList.push(k[j].name);
                            }
                        }
                    }
                    this.subjectList = subjectList;
                    this.subjects = subjects;
                    return subjects;
                })
                .then((res) => {
                    return this.alphabetMake(res);
                })
                .then((res) => {
                    this.subjectsLoaded = true;
                })
                .catch((err) => {
                    console.error(err);
                });
        },

    }
};

// Vue.component('the-form-search', {
//     template: '#the-form-search-template',
//     delimiters: ['{#', '#}'],
//     mixins: [loadDataMixin],
//     components: {
//         Multiselect: VueMultiselect.default
//     },
//     data: function () {
//         return {
//             currentList: '',
//             selected_worktype: null,
//             worktypesOptions: [
//                 {title: 'Реферат', value: ''},
//                 {title: 'Курсовая', value: ''},
//                 {title: 'Дипломная', value: ''},
//                 {title: 'Контрольная', value: ''},
//                 {title: 'Отчет', value: ''},
//                 {title: 'Доклад', value: ''},
//                 {title: 'Учебник', value: ''},
//                 {title: 'Шпаргалка', value: ''},
//                 {title: 'Эссе', value: ''},
//                 {title: 'Монография', value: ''}
//             ]
//         }
//     },
//     created() {
//         this.loadSubjects;
//         this.loadWorktype;
//     },
//     computed: {
//         computedList: function () {
//             let searchQuery = this.currentList;
//             return this.subjects[searchQuery];
//         },
//     },
//     methods: {
//         showList: function (elt, event) {
//             this.currentList = elt;
//         },
//         updateSelected (newSelected) {
//             this.selected = newSelected
//         },
//         customWorktypeLabel ({ title }) {
//             return `${title}`
//         }
//     }
// });

Vue.component('the-form-shop', {
    template: '#the-form-shop-template',
    delimiters: ['{#', '#}'],
    mixins: [loadDataMixin],
    components: {
        Multiselect: VueMultiselect.default
    },
    data: function () {
        return {
            currentList: '',
            selected_worktype: null,
            worktypesOptions: [
                { title: 'Реферат', value: '' },
                { title: 'Курсовая', value: '' },
                { title: 'Дипломная', value: '' },
                { title: 'Контрольная', value: '' },
                { title: 'Отчет', value: '' },
                { title: 'Доклад', value: '' },
                { title: 'Учебник', value: '' },
                { title: 'Шпаргалка', value: '' },
                { title: 'Эссе', value: '' },
                { title: 'Монография', value: '' }
            ]
        }
    },
    created() {
        // this.loadSubjects;
        // this.loadWorktype;
    },
    computed: {
        computedList: function () {
            let searchQuery = this.currentList;
            return this.subjects[searchQuery];
        },
    },
    methods: {
        showList: function (elt, event) {
            this.currentList = elt;
        },
        updateSelected(newSelected) {
            this.selected = newSelected
        },
        customWorktypeLabel({ title }) {
            return `${title}`
        }
    }
});

Vue.component('app-modal-form', {
    template: '#app-modal-form-template',
    props: ['message', 'list'],
    delimiters: ['{#', '#}'],
});

let orderMixin = {
    data: function () {
        return {
            worktypes: [],
            subjects: [],
            subjectList: [],
            url: {
                worktypes: 'https://client.readywork.ru/rest/worktypes/',
                subjects: 'https://client.readywork.ru/rest/subjects/'
            }
        }
    },
    methods: {
        loadWorktype() {
            fetch(this.url.worktypes)
                .then((res) => {
                    return res.json();
                })
                .then((obj) => {
                    this.worktypes = obj.results;
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        loadSubjects() {
            fetch(this.url.subjects)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    this.subjectList = data;
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        customWorktypeLabel({ title }) {
            return `${title}`
        }
    }
};

Vue.component('the-form-contact', {
    template: '#the-form-contact-template',
    delimiters: ['{#', '#}'],
    mixins: [validationMixin, serverFieldErrorsMixin],
    data: function () {
        return {
            fio: '',
            email: '',
            question: '',
            submit: {
                errors: {},
                error_unknown: 'Ошибка! Запрос не отправлен!',
                success_message: 'Спасибо! Ваш запрос отправлен!'
            },
            pending: false
        }
    },
    validations() {
        return {
            fio: {
                required,
                minLength: minLength(1),
                maxLength: maxLength(80)
            },
            email: {
                required,
                email,
                minLength: minLength(5),
                maxLength: maxLength(80)
            },
            question: {
                required,
                minLength: minLength(1),
                maxLength: maxLength(250)
            }
        }
    },
    computed: {
        serialize() {
            let fd = new FormData();

            fd.append('fio', this.fio);
            fd.append('email', this.email);
            fd.append('question', this.question);

            return fd;
        }
    },
    methods: {
        submitForm() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                this.pending = true;

                let $this = this;
                let URL = '/contacts/send';
                let headers = new Headers({ 'Content-type': 'multipart/form-data' });
                let data = {
                    method: 'POST',
                    headers,
                    body: this.serialize
                };

                fetch(URL, data)
                    .then((res) => {
                        $this.pending = false;
                        if (res.status >= 200 && res.status < 300) {
                            $this.openSumbitModal({
                                message: $this.submit.success_message,
                            })
                        } else {
                            $this.openSumbitModal({
                                message: $this.submit.error_unknown,
                                list: {
                                    field: res.status,
                                    text: res.statusText
                                }
                            });
                        }
                    })
                    .catch((err) => {
                        $this.pending = false;
                        $this.openSumbitModal({
                            message: $this.submit.error_unknown
                        });
                    });
            }
        }
    }
});

Vue.component('the-form-order', {
    template: '#the-form-order-template',
    delimiters: ['{#', '#}'],
    mixins: [orderMixin, validationMixin, serverFieldErrorsMixin],
    components: {
        Multiselect: VueMultiselect.default,
        VueTelInput: VueTelInput.default,
        Datepicker: VueDatepicker
    },
    data: function () {
        return {
            ru: ru,
            state: {
                disabledDates: {
                    to: new Date()
                }
            },
            order: {
                worktype: '',
                subjectText: '',
                description: '',
                deadLine: '',
                pagesAll: '',
                comment: '',
                filesId: [],
                promo: '',
            },
            client: {
                fio: '',
                email: '',
                phone: ''
            },
            maxFileCount: MAX_FILES_COUNT,
            maxFileSize: MAX_FILES_SIZE,
            fileCount: null,
            phoneIsValid: false,
            stage: {
                current: 2,
                total: 2
            },
            submit: {
                errors: {},
                error_unknown: 'Ошибка создания заказа!',
                success_message: 'Заказ создан! Через несколько секунд вы будете перенаправлены в личный кабинет...'
            },
            pending: false,
            filesUpload: {
                files: []
            }
        }
    },
    validations() {
        return {
            order: {
                worktype: {
                    required
                },
                subjectText: {
                    minLength: minLength(1),
                    maxLength: maxLength(80),
                    required
                },
                deadLine: {
                    required,
                    validDate,
                    minValue: minValue(TOMORROW_DATE)
                },
                description: {
                    required,
                    minLength: minLength(3),
                    maxLength: maxLength(80)
                },
                pagesAll: {
                    required,
                    minValue: minValue(1),
                    minLength: minLength(1),
                    maxLength: maxLength(80)
                },
                comment: {
                    minLength: minLength(1),
                    maxLength: maxLength(80)
                },
                files: {
                    maxLength: maxLength(this.maxFileCount),
                    maxFileSize: maxFileSize(this.maxFileSize)
                }
            },
            client: {
                fio: {
                    required,
                    minLength: minLength(1),
                    maxLength: maxLength(80)
                },
                email: {
                    required,
                    email,
                    minLength: minLength(5),
                    maxLength: maxLength(80)
                },
                phone: {
                    required,
                    validPhone: validPhone(this.phoneIsValid)
                },
            },
            stage_1: [
                'order.worktype',
                'order.subjectText',
                'order.pagesAll'
            ],
            stage_2: [
                'order.deadLine',
                'order.description',
                'order.comment',
                'order.files',
                'client.fio',
                'client.email',
                'client.phone'
            ],
        }
    },
    created() {
        this.loadSubjects();
        this.loadWorktype();
    },
    mounted: function () {
        this.reset();
    },
    computed: {
        inverseDate: function () {
            return this.order.deadLine.toLocaleDateString().split('.').reverse().join('-');
        },
        serializeOrder() {
            return JSON.stringify({
                'worktype': this.order.worktype.id,
                'subjectText': this.order.subjectText,
                'deadLine': this.inverseDate,
                'pagesAll': this.order.pagesAll,
                'description': this.order.description,
                'comment': this.order.comment,
                'phone': this.client.phone,
                'email': this.client.email,
                'fio': this.client.fio,
                'promo': this.order.promo,
                'filesId': this.order.filesId,
            })
        },
        serializeClient() {
            return JSON.stringify({
                'phone': this.client.phone,
                'email': this.client.email,
                'fio': this.client.fio
            })
        }
    },
    methods: {
        reset() {
            this.order.files = [];
        },
        addSubject(newTag) {
            const tag = newTag;
            this.subjectList.push(tag);
            this.order.subjectText = tag;
        },
        onPhoneInput({ isValid }) {
            this.phoneIsValid = isValid;
        },
        filesChange(fieldName, fileList) {
            this.$v.order.files.$touch();

            let $this = this;

            if (!fileList.length) return;

            for (let i = 0; i < fileList.length; i++) {

                let file = fileList[i];
                let currentFilesCount = $this.filesUpload.files.length;

                if (fileList.length > 3) {
                    console.log('Можно загр' +
                        'ужать не более трех файлов за один раз!');
                    return
                }

                $this.filesUpload.files.push(file);

                if (file.size < 10000000) {

                    $this.filesUpload.files[currentFilesCount].show = true;

                    let fd = new FormData();
                    fd.append('file1', file);
                    let xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener('progress', progressHandler, false);
                    xhr.addEventListener('load', completeHandler, false);
                    xhr.addEventListener('error', errorHandler, false);
                    xhr.addEventListener('abort', abortHandler, false);
                    xhr.open('POST', 'https://client.readywork.ru/rest/client/orders/ajaxFile/');
                    xhr.send(fd);

                    function progressHandler(e) {
                        let percent = (e.loaded / e.total) * 100;
                        $this.filesUpload.files[currentFilesCount].width = Math.round(percent);
                        $this.pending = true;
                    }

                    function completeHandler(e) {
                        let res = JSON.parse(e.target.responseText);
                        $this.order.filesId.push(res.files[0].id);
                        $this.filesUpload.files[currentFilesCount].color = '#76bc00';
                        $this.pending = false;
                    }

                    function errorHandler(e) {
                        $this.pending = false;
                        console.log('Upload Failed');
                        $this.filesUpload.files[currentFilesCount].color = '#ff4500';
                    }

                    function abortHandler(e) {
                        $this.pending = false;
                        console.log('Upload Aborted');
                    }
                } else {
                    console.log('Размер файла не должен превышать 10Мб');
                }
            }
            this.$refs.files.value = '';
        },
        addFiles() {
            this.$refs.files.click();
        },
        removeFile(key) {
            this.filesUpload.files.splice(key, 1);
        },
        processStage() {
            let stage = 'stage_' + this.stage.current;
            this.$v[stage].$touch();

            if (!this.$v[stage].$invalid && (this.stage.current !== this.stage.total)) {
                this.stage.current += 1;
            } else if (!this.$v.order.$invalid && this.stage.current === this.stage.total && !this.pending) {
                this.submitForm();
            }
        },
        submitForm() {
            let errors;
            let $this = this;

            $this.submit.errors = {};
            $this.pending = true;

            if (this.$store.state.isAuth) {
                $this.createOrder($this.serializeOrder);
            } else {
                this.$store.dispatch({
                    type: 'createClient',
                    client: $this.serializeClient
                })
                    .then((res) => {
                        if (res.status === 200) {
                            $this.pending = false;
                            res.json()
                                .then((data) => {
                                    $this.setErrors(data);
                                })
                                .catch((err) => {
                                    console.error(err)
                                })
                        } else if (res.status === 201) {
                            res.json()
                                .then((data) => {
                                    $this.$store.commit('setUser', data);
                                })
                                .then(() => {
                                    $this.createOrder($this.serializeOrder);
                                })
                                .then(() => {
                                    try {
                                        ym(18751747, 'reachGoal', 'readySubmitForm');
                                    } catch (e) {
                                        console.error('yacount readySubmitForm err');
                                    }
                                })
                                .catch((err) => {
                                    $this.pending = false;
                                    console.error(err)
                                })
                        } else {
                            $this.pending = false;
                            $this.openSumbitModal({
                                message: 'Сервис временно недоступен!',
                                list: {
                                    field: res.status,
                                    text: res.statusText
                                }
                            });
                        }
                    })
                    .catch((err) => {
                        $this.pending = false;
                        $this.openSumbitModal({
                            message: 'Сервис временно недоступен!',
                            list: {
                                field: 'Текущая ошибка',
                                text: err
                            }
                        });
                        console.error(err);
                    });
            }
        },
        createOrder(data) {
            let $this = this;

            this.$store.dispatch({
                type: 'createOrder',
                order: data
            })
                .then((res) => {
                    $this.pending = false;
                    if (res.status >= 200 && res.status < 300) {
                        window.location.assign('https://client.readywork.ru/');
                    } else if (res.status === 400) {
                        errors = JSON.parse(res.responseText);
                        $this.setErrors(errors);
                    } else {
                        $this.openSumbitModal({
                            message: $this.submit.error_unknown,
                            list: {
                                field: res.status,
                                text: res.statusText
                            }
                        });
                    }
                })
                .catch((err) => {
                    $this.pending = false;
                    $this.openSumbitModal({
                        message: 'Сервис временно недоступен!',
                        list: {
                            field: 'Текущая ошибка',
                            text: err
                        }
                    });
                    console.error(err);
                });
        }
    }
});

const store = new Vuex.Store({
    state: {
        isAuth: false,
        token: '',
        user: {},
        buyReadyWork: false
    },
    mutations: {
        setUser(state, data) {
            if (!data.error) {
                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        Vue.set(state.user, key, data[key])
                    }
                }
                if (!!data.Token) {
                    setCookie('token', data.Token, {
                        domain: '.readywork.ru',
                        expires: 86400,
                        path: '/'
                    });
                    state.token = data.Token;
                    state.isAuth = true;
                }
            }
        },
        logOut: state => {
            setCookie('token', '', {
                domain: '.readywork.ru',
                expires: -1,
                path: '/'
            });
            state.user = {};
            state.token = '';
            state.isAuth = false;
        },
        sessionInit: state => {
            if (!!getCookie('token')) {
                state.token = getCookie('token');
                state.isAuth = true;
            }
        },
        buyReadyWork(state, bool) {
            state.buyReadyWork = bool;
        }
    },
    actions: {
        getClient({ commit, state }) {
            if (!!getCookie('token')) {
                state.token = getCookie('token');
                state.isAuth = true;

                let URL = 'https://client.readywork.ru/rest/client/';
                let headers = new Headers({
                    'Token': state.token
                });
                let getClientData = {
                    method: 'GET',
                    headers
                };

                fetch(URL, getClientData)
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        commit('setUser', data);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        },
        createOrder({ commit, state }, orderData) {
            let URL = 'https://client.readywork.ru/rest/client/orders/';
            let headers = new Headers({
                'Content-type': 'application/json',
                'Token': state.token
            });
            let newOrder = {
                method: 'POST',
                headers,
                body: orderData.order
            };
            return new Promise((resolve, reject) => {
                fetch(URL, newOrder)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        createClient({ commit }, clientData) {
            let URL = 'https://client.readywork.ru/rest/client/';
            let headers = new Headers({
                'Content-type': 'application/json'
            });
            let newClientInit = {
                method: 'POST',
                headers,
                body: clientData.client
            };

            return new Promise((resolve, reject) => {
                fetch(URL, newClientInit)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        loginClient({ commit }, clientData) {
            let URL = 'https://client.readywork.ru/rest/client/login/';
            let headers = new Headers({
                'Content-type': 'application/json'
            });
            let data = {
                method: 'POST',
                headers,
                body: clientData.client
            };

            return new Promise((resolve, reject) => {
                fetch(URL, data)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },
        remindClient({ commit }, clientData) {
            let URL = 'https://client.readywork.ru/rest/client/remind/';
            let headers = new Headers({
                'Content-type': 'application/json'
            });
            let data = {
                method: 'POST',
                headers,
                body: clientData.email
            };

            return new Promise((resolve, reject) => {
                fetch(URL, data)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }
    }
});

Vue.directive('app-scroll', {
    inserted: function (el, binding) {
        let scrollTimeout = null;
        let scrollThrottler = function (event) {
            if (!this.scrollTimeout) {
                this.scrollTimeout = setTimeout(function () {
                    this.scrollTimeout = null;
                    window.scrollY > 1
                        ? el.classList.add(binding.value)
                        : el.classList.remove(binding.value);
                }, 66);
            }
        };
        window.addEventListener('scroll', scrollThrottler)
    }
});

let vm = new Vue({
    store,
    components: {
        Vuedals: Vuedals.Component,
    },
    data: {
        pending: false
    },
    created() {
        this.$nextTick(function () {
            this.$store.dispatch('getClient');
        });

        Bus.$on('clientSet', () => {
            this.$store.commit('buyReadyWork', false);
            this.submitReadyWork(this.serializeOrder);
        })
    },
    computed: {
        serializeOrder() {
            return JSON.stringify({
                'worktype': window.workData.worktype,
                'pagesAll': window.workData.str,
                'comment': window.workData.comment,
                'subjectText': window.workData.subject,
                'description': window.workData.name,
                'deadLine': window.workData.deadline,
            })
        }
    },
    methods: {
        openPaymentGuide(e) {
            let btn = e.target;
            let target = btn.nextElementSibling;

            if (!!target) {
                if (!target.classList.contains('_open')) {
                    target.classList.add('_open');
                    btn.classList.add('_disabled');
                } else {
                    target.classList.remove('_open');
                    btn.classList.remove('_disabled');
                }
            }
        },
        openLoginModal(type) {
            let $this = this;
            Bus.$emit('new', {
                name: 'app-login-modal',
                props: { initialType: type },
                component: 'app-login',
                onDismiss() {
                    $this.$store.commit('buyReadyWork', false);
                },
                onClose() {
                    $this.$store.commit('buyReadyWork', false);
                },
            });
        },
        buyReadyWork() {
            this.pending = true;
            if (!this.$store.state.isAuth) {
                this.$store.commit('buyReadyWork', true);
                this.openLoginModal('registration');
            } else {
                this.submitReadyWork(this.serializeOrder);
            }
        },
        submitReadyWork(data) {
            let $this = this;
            this.$store.dispatch({
                type: 'createOrder',
                order: data
            })
                .then((res) => {
                    $this.pending = false;
                    if (res.status >= 200 && res.status < 300) {
                        try {
                            ym(18751747, 'reachGoal', 'uniqueSubmitForm');
                        } catch (e) {
                            console.error('yacount uniqueSubmitForm err');
                        }
                        setTimeout(function () {
                            window.location.assign('https://client.readywork.ru/');
                        }, 1000);
                    } else {
                        try {
                            res.json()
                                .then((data) => {
                                    $this.openSumbitModal({
                                        message: data.detail,
                                    });
                                })
                                .catch((err) => {
                                    console.error(err)
                                })
                        } catch (err) {
                            $this.openSumbitModal({
                                message: 'Ошибка!',
                                list: {
                                    field: res.status,
                                    text: res.statusText
                                }
                            });
                        }
                    }
                })
                .catch((err) => {
                    $this.pending = false;
                    $this.openSumbitModal({
                        message: 'Проверьте правильность ввода полей'
                    });
                    console.error(err);
                });
        }
    }
}).$mount('#app');

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options) {
    options = options || {};

    let expires = options.expires;

    if (typeof expires === 'number' && expires) {
        let d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }

    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    let updatedCookie = name + '=' + value;

    for (let key in options) {
        updatedCookie += '; ' + key;
        let keyValue = options[key];
        if (keyValue !== true) {
            updatedCookie += '=' + keyValue;
        }
    }
    document.cookie = updatedCookie;
}
function deleteCookie(name) {
    setCookie(name, '', {
        expires: -1
    })
}


// TABS
(function () {
    // Get relevant elements and collections
    const tabbed = document.querySelector('.tabs');
    const tablist = tabbed.querySelector('.tabs__list');
    const tablistItems = tabbed.querySelectorAll('.tabs__item');
    const tabs = tablist.querySelectorAll('.tabs__link');
    const panels = tabbed.querySelectorAll('[id^="section"]');

    // The tab switching function
    const switchTab = function (oldTab, newTab) {
        newTab.focus();
        // Make the active tab focusable by the user (Tab key)
        newTab.removeAttribute('tabindex');
        // Set the selected state
        newTab.setAttribute('aria-selected', 'true');
        oldTab.removeAttribute('aria-selected');
        oldTab.setAttribute('tabindex', '-1');
        // Get the indices of the new and old tabs to find the correct
        // tab panels to show and hide
        let index = Array.prototype.indexOf.call(tabs, newTab);
        let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
        panels[oldIndex].hidden = true;
        panels[index].hidden = false;
    }

    // Add the tablist role to the first <ul> in the .tabbed container
    tablist.setAttribute('role', 'tablist');

    // Add semantics are remove user focusability for each tab
    Array.prototype.forEach.call(tabs, function (tab, i) {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('id', 'tab' + (i + 1));
        tab.setAttribute('tabindex', '-1');
        tab.parentNode.setAttribute('role', 'presentation');

        // Handle clicking of tabs for mouse users
        tab.addEventListener('click', function (e) {
            e.preventDefault();

            Array.prototype.forEach.call(tablistItems, function (item, i) {
                item.classList.remove('active')
            });
            e.target.parentElement.classList.add('active');

            let currentTab = tablist.querySelector('[aria-selected]');
            if (e.currentTarget !== currentTab) {
                switchTab(currentTab, e.currentTarget);
            }
        });

        // Handle keydown events for keyboard users
        tab.addEventListener('keydown', function (e) {
            // Get the index of the current tab in the tabs node list
            let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
            // Work out which key the user is pressing and
            // Calculate the new tab's index where appropriate
            let dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;
            if (dir !== null) {
                e.preventDefault();
                // If the down key is pressed, move focus to the open panel,
                // otherwise switch to the adjacent tab
                dir === 'down' ? panels[i].focus() : tabs[dir] ? switchTab(e.currentTarget, tabs[dir]) : void 0;
            }
        });
    });

    // Add tab panel semantics and hide them all
    Array.prototype.forEach.call(panels, function (panel, i) {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('tabindex', '-1');
        let id = panel.getAttribute('id');
        panel.setAttribute('aria-labelledby', tabs[i].id);
        panel.hidden = true;
    });

    // Initially activate the first tab and reveal the first tab panel
    tablistItems[0].classList.add('active');
    tabs[0].removeAttribute('tabindex');
    tabs[0].setAttribute('aria-selected', 'true');
    panels[0].hidden = false;
})();
