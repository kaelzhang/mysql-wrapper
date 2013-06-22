# Mysql-wrapper

A wrapper of [node-mysql](https://github.com/felixge/node-mysql) to improve fault tolerance, including enhanced query generator and data escaping powered by [typo](https://github.com/kaelzhang/typo) template engine.

Mysql-wrapper is also a ** supervisor ** and a ** minor ** set of node-mysql.

Mysql-wrapper is created to solve the "Cannot enqueue Handshake after already enqueuing a Handshake" error of node-mysql.

## Installation

	npm install mysql-wrapper --save
	
## Usage

```js
var mysql = require('mysql-wrapper');
var conn = mysql({
	host: '127.0.0.1',
	port: '3306',
	user: 'root',
	password: '123456',
	database: 'test',
});
conn.query(...);
```
	

## conn.query(sql, data, callback)

Execute a mysql query.

If you use helpers below, the parameters will be ** automatically escaped if necessary ** in order to avoid SQL Injection attacks.

#### sql
`String`

`sql` support a special version of [typo](https://github.com/kaelzhang/typo) syntax which optimized for sql grammar.

#### data
`Object`

Template data for typo

#### callback
`function(err, result)`

Callback of mysql quering

### Example: Available helpers

##### Mysql WHERE: {{where data}}

```js
conn.query('SELECT * FROM table {{where data}}', {
	data: {
		a: 1,
		b: 'abc'
	}
}, function(err, result){
	console.log(err, result)
});
```
	
##### Mysql VALUES: {{values values}}

```js
'INSERT INTO table {{values values}}', {
	data: {
		a: 1,
		b: 2
	}
}

-> INSERT INTO table (a, b) VALUES ('1', '2')
```	
	
##### Mysql SET: {{set data}}

```js
'INSERT INTO table {{set data}}', {
	data: {
		a: 1,
		b: 2
	}
}

-> INSERT INTO table SET a = '1', b = '2'
```
	
##### Mysql ON: {{on condition}}

##### Mysql UPDATE: {{update data}}

##### Use them together

```js
'SELECT p.a, p.b, q.a FROM p INNER JOIN q {{on 0}} {{where 1}}', [
	{
		'p.a': 'q.a',
	}, 
	{
		'q.b': 1
	}
]
```

### conn.end()

Close the current connection, if there's another `conn.query` executed, the connection will be ** automatically created ** again.