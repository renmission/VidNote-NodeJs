const moment = require('moment');

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }

        req.flash('error_msg', 'Not Authorized');
        res.redirect('/users/login');
    },

    generateDate: (date, format) => {
        return moment(date).format(format);
    }
}

