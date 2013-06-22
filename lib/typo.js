'use strict';

var typo = module.exports = require('typo');
var escape = require('mysql').escape;

var REGEX_IS_OR = /^or$/i;

function join_object(value, prefix, joiner, escape) {
    return prefix + ' ' + Object.keys(value).map(function(key) {
        return key + ' = ' + ( escape ? conn.connection.escape( value[key] ) : value[key] );
    
    }).join(joiner);
}

var MYSQL_HELPERS = {

    // @param {Object} value
    // '{{where where}}', {a: 1, b: 2}
    // -> "WHERE a = '1' AND b = '2'"
    where: function(value) {
        var type = REGEX_IS_OR.test(this.data) ? ' OR ' : ' AND '
        return join_object(value, 'WHERE', type, true);
    },

    // 
    set: function(value) {
        return join_object(value, 'SET', ', ', true);
    },

    update: function(value) {
        return join_object(value, 'UPDATE', ', ', true);
    },

    // 
    values: function(data) {
        var keys = Object.keys(data);
        var values = keys.map(function(key) {
            return conn.connection.escape(data[keys]);
        });

        return '(' + keys.join(', ') + ') VALUES (' + values.join(', ') + ')' 
    },

    on: function(value) {
        var type = REGEX_IS_OR.test(this.data) ? ' OR ' : ' AND '
        return join_object(value, 'ON', type, false);
    },

    escape: function(value) {
        return conn.connection.escape( value );
    }
};

typo.register(MYSQL_HELPERS);

