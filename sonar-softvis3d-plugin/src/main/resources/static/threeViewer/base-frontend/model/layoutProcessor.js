/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
var CodeCityVis = require('codecity-visualizer');
var IllustratorEvostreet = CodeCityVis.illustrators.evostreet;
var IllustratorDistrict = CodeCityVis.illustrators.district;
var attributeHelper = CodeCityVis.helper.attributes;

class LayoutProcessor {

    constructor(layout) {
        switch (layout) {
            case 'evostreet':
                this.setLayoutEvostreet();
                break;
            default:
                this.setLayoutDistrict();
                break;
        };
    }

    setLayoutEvostreet() {
        this._illustrator = IllustratorEvostreet;

        this._options = {
            'layout.snail': false,
            'house.margin': 6,
            'highway.length': 50,
            'evostreet.options': {
                'spacer.initial': 40,
                'spacer.conclusive': 0,
                'spacer.branches': 25,
                'house.container': CodeCityVis.containers.lightmap,
                'house.distribution': 'left'
            }
        };

        this._rules = [];
        this._rules.push(this._Rule1());
        this._rules.push(this._Rule2());
        this._rules.push(this._Rule3());
        this._rules.push(this._Rule4());
    }

    setLayoutDistrict() {
        this._illustrator = IllustratorDistrict;

        this._options = {
            'layout.tower': false,
            'house.margin': 6,
            'spacer.margin': 25,
            'spacer.padding': 15
        };

        this._rules = [];
        this._rules.push(this._Rule1());
        this._rules.push(this._Rule2());
        this._rules.push(this._Rule3());
        this._rules.push(this._Rule5());
    }

    getIllustration(model, version) {
        const illustrator = new this._illustrator(model, this._options);

        for (const rule of this._rules) {
            illustrator.addRule(rule);
        }

        return illustrator.draw(version);
    }

    /**
     * Height-Metric --> Building Height
     * @private
     * @returns {BaseRule}
     */
    _Rule1() {
        return new CodeCityVis.rules.math.logarithmic({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricHeight' in attr) ? attr.metricHeight : 0;
            },
            'attributes': 'dimensions.height',
            'min': 12,
            'max': 260,
            'logbase': 3.40,
            'logexp': 3.25
        });
    }

    /**
     * Footprint-Metric --> Building Base
     * @private
     * @returns {BaseRule}
     */
    _Rule2() {
        return new CodeCityVis.rules.math.logarithmic({
            'condition': function(model, node, version) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricFootprint' in attr) ? attr.metricFootprint : 0;
            },
            'attributes': ['dimensions.length', 'dimensions.width'],
            'min': 14,
            'max': 150,
            'logbase': 3.60,
            'logexp': 3.15
        });
    }

    /**
     * Package-Name --> Building Color
     * @private
     * @returns {BaseRule}
     */
    _Rule3() {
        return new CodeCityVis.rules.color.assigned({
            'condition': function(model, node, version) {
                return node.children.length === 0 && node.parent;
            },
            'metric': function(model, node, version) {
                return String(node.parent);
            },
            'attributes': 'color'
        });
    }

    /**
     * Package-Depth --> Street Color
     * @private
     * @returns {BaseRule}
     */
    _Rule4() {
        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node, version) {
                return node.children.length !== 0;
            },
            'metric': function(model, node, version) {
                let level = 0;
                while(node = node.parent) {
                    level++;
                }
                return Math.min(level, 10);
            },
            'attributes': 'color',
            'max': 10,
            'minColor': 0x157f89,
            'maxColor': 0x0b2d5c
        });
    }

    /**
     * Package-Depth --> Street Color (Grey)
     * @private
     * @returns {BaseRule}
     */
    _Rule5() {
        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node, version) {
                return node.children.length !== 0;
            },
            'metric': function(model, node, version) {
                let level = 0;
                while(node = node.parent) {
                    level++;
                }
                return Math.min(level, 9);
            },
            'attributes': 'color',
            'max': 9,
            'minColor': 0x252525,
            'maxColor': 0xEEEEEE
        });
    }
}

module.exports = LayoutProcessor;