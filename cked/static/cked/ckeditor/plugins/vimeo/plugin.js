/*
* Vimeo plugin per Maieutica
*
* Plugin name:      vimeo
* Menu button name: Vimeo
*
* @author Simone Basso
* @version 0.1
*/

CKEDITOR.plugins.add( 'vimeo', {
    icons: 'vimeo',
    init: function( editor ) {
        editor.addCommand( 'vimeoDialog', new CKEDITOR.dialogCommand( 'vimeoDialog' ) );

        editor.ui.addButton( 'Vimeo', {
            label: 'Vimeo Video',
            command: 'vimeoDialog',
            toolbar: 'insert'
        });
        
        CKEDITOR.dialog.add( 'vimeoDialog', this.path + 'dialogs/vimeo.js' );
        
        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'vimeoGroup' );
            editor.addMenuItem( 'vimeoItem', {
                label: 'Modifica video',
                icon: this.path + 'icons/vimeo.png',
                command: 'vimeoDialog',
                group: 'vimeoGroup'
            });

            editor.contextMenu.addListener( function( element ) {
                if ( element.getAscendant( 'iframe', true ) && element.getAttribute("data-vimeo") == 'true' ) {
                    return { vimeoItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }

    }
});
