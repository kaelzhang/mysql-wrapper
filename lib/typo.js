'use strict';

var typo = module.exports = require('typo');
var mysql_escape = require('mysql').escape;

var REGEX_IS_OR = /^or$/i;


// @param {Object|string} value
// @param {string} prefix
// @param {string} joiner
// @param {boolean} escape_default
// @param {options.timezone} timezone
function join_object (value, prefix, joiner, escape_default, timezone) {
    return prefix + ' ' + Object.keys(value).map(function(key) {
        return key + ' = ' + escape( value[key], escape_default, timezone );
    
    }).join(joiner);
}

// @param {Object|string} value
// @param {boolean} escape_default
// @param {options.timezone} timezone
function escape(value, escape_default, timezone){
    var to_escape = escape_default;

    if(Object(value) === value){
        if( 'escape' in value ){
            to_escape = value.escape;
        }

        value = value.value
    }

    return to_escape ?
        mysql_escape(value, false, timezone) :
        value;
}


var MYSQL_HELPERS = {

    // @param {Object} value
    // {a: 1, b: 2}
    // -> "WHERE a = '1' AND b = '2'"
    where: function(value) {
        var type = REGEX_IS_OR.test(this.data) ? ' OR ' : ' AND ';
        return join_object(value, 'WHERE', type, true, this.data.timezone);
    },

    // {a: 1, b: 2}
    // -> "SET a = '1', b = '2'"
    set: function(value) {
        return join_object(value, 'SET', ', ', true, this.data.timezone);
    },

    // {a: 1, b: 2}
    // -> "UPDATE a = '1', b = '2'"
    update: function(value) {
        return join_object(value, 'UPDATE', ', ', true, this.data.timezone);
    },

    // {{a: 1, b: 2}}
    // "(a, b) VALUES ('1', '2')"
    values: function(data) {
        var keys = Object.keys(data);
        var values = keys.map(function(key) {
            return escape(data[keys], true, this.data.timezone);
        });

        return '(' + keys.join(', ') + ') VALUES (' + values.join(', ') + ')' 
    },

    // default to not escape
    // {'p.a': 'q.a'}
    // "ON p.a = a.a"
    on: function(value) {
        var type = REGEX_IS_OR.test(this.data) ? ' OR ' : ' AND '
        return join_object(value, 'ON', type, false, this.data.timezone);
    },

    // 1
    // -> '1'
    escape: function(value) {
        return escape( value, true, this.options.timezone);
    }
};

typo.register(MYSQL_HELPERS);



// timezone and escape