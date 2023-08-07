import {LatexToTree} from '../checkmath.js';
/**
 *  Locian Answer Checking Organizer
 */

export class Laco {
    _logs = [];
    _tree = [];
    _instance = null;
    _before = [];

    constructor() { 

    }

    getInstance() {
        if (null === this._instance) {
            this._instance = new Laco();
        }
        return this._instance;
    }

    initialize(tree = []) {
        var tree_1 = JSON.parse(JSON.stringify(tree)); 
        this._tree = tree_1;
        this._before = tree_1;
        this._logs = [new Map([
            ['key', 'initialized'],
            ['tree', this._tree]
        ])];
        return this.getInstance();
    }

    setTree(tree = []) {
        var tree_1 = JSON.parse(JSON.stringify(tree));
        
        if (JSON.stringify(this._tree) == JSON.stringify([])) {
            this._tree = tree_1;
        }
        return this;
    }

    getTree() {
        return this._tree;
    }

    apply() {
        
        var args = [...arguments];
        var func = args.shift();

        if (typeof func === 'function') {
            this._tree = func.apply(null, [this._tree].concat(args));
            
        } else {
            this.getInstance().log('ERROR : '+ func.toString() +' doesn\'t exist.', false);
        }

        if (JSON.stringify(this._before) != JSON.stringify(this._tree)) {
            this.getInstance().log('changed by ' + func.toString());
        }

        this._before = this._tree;

        return this;
    }

    finalize() { 
        this.log('finalized');
        return this._tree; 
    }

    log(key = null, type = 1) {
        var log = new Map([
            ['key', key],
            ['type', type],
            ['tree', this._tree]
        ]);
        this._logs.push(log);

        return this;
    }

    parse(latex) {
        return LatexToTree(latex);
    }

    parseTree(tree) {
        var tree_1 = JSON.parse(JSON.stringify(tree));
        if (Array.isArray(tree_1)) {
            var operator = tree_1[0];
            var operands = tree_1.slice(1);

            for (var k in operands) {
                operands[k] = this.parseTree(operands[k]);
            }
            return new Map([
                ['operator', operator],
                ['operands', operands]
            ]);
        } else {
            return tree_1;
        }
    }

    getLogs() {
        return this._logs;
    }

    getTable(a) {
        if (!Array.isArray(a)) {
            return a;
        }

        var html = '<table class="laco"><tr><td colspan="2">' + a[0] + '</td></tr>';
        for (var [k, v] of a.entries()) {
            if (!k) {
                continue;
            }

            html += '<tr><td class="margin"></td><td>' + this.getTable(v) + '</td></tr>';
        }
        html += '</table>';

        return html;
    }

    getLatex(tree) {
        var tree_1 = JSON.parse(JSON.stringify(tree));
        if (!Array.isArray(tree_1)) {
            return ['gt', 'ge', 'lt', 'le'].includes(tree) ? '\\' + tree_1 + ' ' : tree;
        }

        var op = tree.shift();

        switch(op) {
            case 'pm':
            case 'addsub':      
                return '\\pm ' + this.getLatex(tree_1[0]);
            case 'mp':          
            case 'subadd':      
                return '\\mp ' + this.getLatex(tree_1[0]);
            case 'sine':        
                return '\\sin{' + this.getLatex(tree_1[0]) + '}';
            case 'tangent':     
                return '\\tan{' + this.getLatex(tree_1[0]) + '}';
            case 'absolute':    
                return '\\left|' + this.getLatex(tree_1[0]) + '\\right|';
            case 'rdecimal':    return this.getLatex(tree_1[0]) + '\\overline{' + this.getLatex(tree_1[2]) + '}';
            case 'natural': 
            case 'decimal': 
            case 'anything':
            case 'variable':    
                return this.getLatex(tree_1[0]);
            case 'positive':
            case 'add':         
                return '+' + (tree_1[0][0].indexOf('chain') ? '(' : '') + this.getLatex(tree_1[0]) + (tree_1[0][0].indexOf('chain') ? ')' : '');
            case 'negative':
            case 'sub':         
                return '-' + (tree_1[0][0].indexOf('chain') ? '(' : '') + this.getLatex(tree_1[0]) + (tree_1[0][0].indexOf('chain') ? ')' : '');
            case 'mul':         
                return '\\cdot ' + (tree_1[0][0].indexOf('chain') ?'(' : '') + this.getLatex(tree_1[0]) + (tree_1[0][0].indexOf('chain') ? ')' : '');
            case 'div':         
                return '\\div ' + (tree_1[0][0].indexOf('chain') ? '(' :'') + this.getLatex(tree_1[0]) + (tree_1[0][0].indexOf('chain') ?')' : '');

            case 'addchain_fixed':
            case 'mulchain_fixed':
            case 'addchain':
            case 'mulchain':    
                var str = tree_1.map(function(v) {return Laco.getLatex(v);}).join();
                return str.replace(/^(\\\\cdot|\+)+/g, '');
            case 'cap': 
                return '(' + this.getLatex(tree_1[0]) + ')\\cap (' + this.getLatex(tree_1[1]) + ')';
            case 'cup': 
                return '(' + this.getLatex(tree_1[0]) + ')\\cup (' + this.getLatex(tree_1[1]) + ')';
            case 'power':    
                return '{' + this.getLatex(tree_1[0]) + '}^{' + this.getLatex(tree_1[1]) + '}';
            case 'fraction':    
                return '\\frac{' + this.getLatex(tree_1[0]) + '}{' + this.getLatex(tree_1[1]) + '}';
            case 'equation':    
                return tree_1.map(function(v){return Laco.getLatex(v);}).join('=');
            case 'inequality':  
                return tree_1.map(function(v){return Laco.getLatex(v);}).join();
            case 'squareroot':  
                return '\\sqrt{' + this.getLatex(tree_1[0]) + '}';
            case 'mangle':      
                return 'm\\angle{' + this.getLatex(tree_1[0]) + '}';
            default :           
                return '\\' + op + '{' + tree_1.map(function(v) {return Laco.getLatex(v);}, tree_1).join() + '}';
        }

        var latex = '';
        for (var [k, v] of tree_1.entries()) {
            latex += this.getLatex(v);
        }

        return latex;
    }

}
