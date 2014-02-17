/*
* Images plugin per Maieutica
*
* Plugin name:      images
* Menu button name: Images
*
* @author Simone Basso
* @version 0.1
*/

CKEDITOR.plugins.add( 'images', {
    icons: 'images',
    init: function( editor ) {
        editor.addCommand( 'imagesDialog', new CKEDITOR.dialogCommand( 'imagesDialog' ) );

        editor.ui.addButton( 'Images', {
            label: 'Images',
            command: 'imagesDialog',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add( 'imagesDialog', this.path + 'dialogs/images.js' );
        
        if ( editor.contextMenu ) {
            editor.addMenuGroup( 'imagesGroup' );
            editor.addMenuItem( 'imagesItem', {
                label: 'Modifica immagine',
                icon: this.path + 'icons/images.png',
                command: 'imagesDialog',
                group: 'imagesGroup'
            });

            editor.contextMenu.addListener( function( element ) {
                if ( element.getAscendant( 'img', true ) ) {
                    return { imagesItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }

    }
});
