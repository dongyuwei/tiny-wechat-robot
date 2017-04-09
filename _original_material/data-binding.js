var formInputValue = 'foo@example.com';

var model = {};
Object.defineProperty(model, 'email', {
    configurable: true,
    enumerable: true,
    get: function () {
        return formInputValue;
    },
    set: function (value) {
        console.log(value);
        formInputValue = value;
    }
});

console.assert(model.email === formInputValue);
model.email = 'bar@example.com';
console.assert(formInputValue === 'bar@example.com');
