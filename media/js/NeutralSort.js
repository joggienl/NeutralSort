/*
 * File:        NeutralSort.js
 * Version:     1.0.1
 * Description: If you want to be able to "reset" your table sorting you can use
 *              this plugin. By reset I mean that the table will be restored in
 *              it's initial state. Unsorting a table can be accomplished to
 *              hold the Shift key and then click on a column.
 * Usage:       - Include the NeutralSort.js file in your page
 *              - Initialization example:
 *                   $('#tableID').dataTable({
 *                       'sDom' : 'Nlfrtip',
 *                       'bNeutralSort' : true
 *                   });
 * Author:      Jogchum Koerts
 * Language:    Javascript
 * License:     GPL v2 or BSD 3 point style
 * Contact:     joggie <at> joggie <dot> nl
 *
 *
 * This source file is free software, under either the GPL v2 license or a
 * BSD style license, available at:
 *   http://datatables.net/license_gpl2
 *   http://datatables.net/license_bsd
 */

(function ($, window, document) {

    "use strict";

    /**
     * This function will restore the order in which data was read into a
     * DataTable (for example from an HTML source). Although you can set
     * aaSorting to be an empty array in order to prevent sorting during
     * initialization, it can sometimes be useful to restore the original order
     * after sorting has already occurred - which is exactly what this function
     * does.
     *
     * @author : Allen Jardine
     * @see    : http://datables.net/plug-ins/api#fnSortNeutral
     */
    $.fn.dataTableExt.oApi.fnSortNeutral = function (oSettings) {
        /* Remove any current sorting */
        oSettings.aaSorting = [];

        /* Sort display array so we get them in numerical order */
        oSettings.aiDisplay.sort(function (x,y) {
            return x-y;
        });

        oSettings.aiDisplayMaster.sort(function (x,y) {
            return x-y;
        });

        /* Redraw */
        oSettings.oApi._fnReDraw(oSettings);
    };

    var NeutralSort = function( oDTSettings, oOpts ) {
        /* Santiy check that we are a new instance */
        if ( !this.CLASS || this.CLASS != "NeutralSort" )
        {
            window.alert( "Warning: NeutralSort must be initialised with the keyword 'new'" );
        }

        if ( typeof oOpts == 'undefined' )
        {
            oOpts = {};
        }

        /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
         * Public class variables
         * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

        /**
         * @namespace Settings object which contains customisable information
         *            for instance
         */
        this.s = {
            /**
             * DataTables settings object
             *  @property dt
             *  @type     Object
             *  @default  null
             */
            "dt": null,

            /**
             * Initialisation object used for this instance
             *  @property init
             *  @type     object
             *  @default  {}
             */
            "init": oOpts,

            /**
             * Is the table just neutralised?
             *  @property _justNeutralized
             *  @type     boolean
             *  @default  false
             */
            "_justNeutralized" : false
        };


        /* Constructor logic */
        this.s.dt = oDTSettings.oInstance.fnSettings();
        this._fnConstruct();

        /* Add destroy callback */
        oDTSettings.oApi._fnCallbackReg(oDTSettings, 'aoDestroyCallback', jQuery.proxy(this._fnDestroy, this), 'NeutralSort');

        /* Store the instance for later use */
        NeutralSort.aoInstances.push( this );
        return this;
    };

    NeutralSort.prototype = {
        "_fnConstruct" : function () {
            if (typeof this.s.init === 'boolean' && this.s.init === true) {
                var that = this;
                $(document).bind('sort', function (event, oTable) {
                    if (  oTable.aaSorting.length === 0 &&
                          typeof that._justNeutralized !== 'undefined' &&
                          !that._justNeutralized) {

                        that._justNeutralized = true;
                        oTable.oInstance.fnSortNeutral();
                    } else if (that._justNeutralized) {
                        that._justNeutralized = false;
                    }
                });
            }
        },

        /**
         * Clean up NeutralSort memory references and event handlers
         *  @method  _fnDestroy
         *  @returns void
         *  @private
         */
        "_fnDestroy": function () {
            var iCount;
            for ( iCount = 0; iCount < NeutralSort.aoInstances.length ; iCount += 1 ) {
                if ( NeutralSort.aoInstances[iCount] === this ) {
                    NeutralSort.aoInstances.splice( iCount, 1 );
                    break;
                }
            }

            this.s.dt.oInstance._oPluginNeutralSort = null;
            this.s = null;
        }
    };

    NeutralSort.aoInstances = [];
    NeutralSort.prototype.version = '1.0.1';
    NeutralSort.CLASS = 'NeutralSort';
    NeutralSort.prototype.CLASS = 'NeutralSort';


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Initialization
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    /*
     * Register a new feature with DataTables
     */
    if ( typeof $.fn.dataTable === 'function' &&
         typeof $.fn.dataTableExt.fnVersionCheck === 'function' &&
         $.fn.dataTableExt.fnVersionCheck('1.9.4') ) {

        $.fn.dataTableExt.aoFeatures.push( {
            'fnInit': function( oDTSettings ) {
                var oTable = oDTSettings.oInstance;
                if ( typeof oTable._oPluginNeutralSort === 'undefined' ) {
                    var opts = typeof oDTSettings.oInit.bNeutralSort !== 'undefined' ?
                        oDTSettings.oInit.bNeutralSort : {};
                    oTable._oPluginNeutralSort = new NeutralSort( oDTSettings, opts );
                } else {
                    oTable.oApi._fnLog( oDTSettings, 1, "NeutralSort attempted to initialise twice. Ignoring second" );
                }

                return null; /* No node to insert */
            },
            'cFeature': 'N',
            'sFeature': 'NeutralSort'
        } );

    } else {
        throw 'Warning: NeutralSort requires DataTables 1.9.4 or greater - www.datatables.net/download';
    }

})(jQuery, window, document);