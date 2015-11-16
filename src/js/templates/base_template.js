/*global define,console*/
define([
        'jquery',
        'handlebars',
        //'text!fx-c-c/html/templates/base_template.hbs'
        'text!fx-c-c/html/templates/custom_template.hbs'
    ],
    function ($, Handlebars, template) {

        'use strict';

        var defaultOptions = {
        };

        function Base_template(config) {
            // this should be always reinitialized
            this.o = $.extend(true, {}, defaultOptions, config);
            return this;
        }

        Base_template.prototype.render = function () {

            if (this._validateInput() === true) {
                this._initVariable();
                this._injectTemplate(template);
            } else {
                console.error(this.o.errors);
                throw new Error("FENIX Chart creator has not a valid configuration");
            }

            return this;
        };

        Base_template.prototype._injectTemplate = function () {
            var t = Handlebars.compile(template);
            var dynamic_data = this.o;
            console.log(dynamic_data);
            var html = t(this.o);
            this.o.$container.html(t(this.o));
        };

        Base_template.prototype._initVariable = function () {
            this.o.$container = $(this.o.container);
        };

        Base_template.prototype._validateInput = function () {

            this.o.errors = {};

            if (!this.o.hasOwnProperty("container")) {
                this.o.errors.container = "'container' attribute not present";
            }

            return (Object.keys(this.o.errors).length === 0);
        };

        Base_template.prototype.destroy = function () {

        };

        return Base_template;
    });