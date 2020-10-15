export const dateMixin = {
    methods: {
        dateFormat(dateObj) {
            // Mon Oct 12 2020 21:58:03 GMT+0300 (GMT+03:00) => Oct 12 2020 21:58:03
            return dateObj.split(' ').splice(1, 4).join(' ')
        }
    }
}