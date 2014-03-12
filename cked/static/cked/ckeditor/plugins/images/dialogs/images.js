CKEDITOR.dialog.add( 'imagesDialog', function ( editor ) {
    return {
        title: 'Immagine',
        minWidth: 600,
        minHeight: 300,

        contents: [
            {
                id: 'tab-my-img',
                label: 'My img',
                elements: [
                    {
                        type: 'html',
                        id: 'my-img',
                        label: 'Le mie immagini',
                        html: '<div id="box" style="border-bottom: 1px solid #eee;"><div id="myImagesDiv"></div></div>',
                    },
                    {//TODO
                        type: 'button',
                        id: 'carica',
                        label: 'Carica una Immagine',
                        title: 'Carica',
                        onClick: function() {
                            var NWin = window.open('/mediamanager/importimage/', '', 'height=800,width=800');
                            if (window.focus)
                            {
                              NWin.focus();
                            }
                        }
                    },
                    {
                        type: 'hbox',
                        widths: [100, 200],
                        children :
                        [
                            {
                                type: 'text',
                                id: 'pk',
                                label: 'Primary Key',
                                labelLayout: 'vertical',
                                validate: CKEDITOR.dialog.validate.notEmpty( "Errore" ),
                                setup: function( element ) {
                                    this.setValue( element.getAttribute( "data-pk" ) );
                                },
                                commit: function( element ) {
                                    element.setAttribute( "data-pk", this.getValue() );
                                }
                            },
                            {
                                type: 'text',
                                id: 'src',
                                label: 'Immagine Originale',
                                labelLayout: 'vertical',
                                validate: CKEDITOR.dialog.validate.notEmpty( "Errore: il campo non può essere vuoto" ),
                                setup: function( element ) {
                                    enter = element.getAttribute( "src" ).replace("/files/", "")
                                    format = element.getAttribute( "data-format" )
                                    a = src.split(".")
                                    e = a[1]
                                    b = a[0]
                                    src = b.slice(0,b.length - format.length) + "." + e
                                    this.setValue( src );
                                },
                            }
                        ]
                    },
                    {
                        type: 'hbox',
                        widths: [100, 200],
                        children :
                        [
                            {
                                 type: 'select',
                                 id: 'format',
                                 label: 'Formato',
                                 validate: CKEDITOR.dialog.validate.notEmpty( "Errore" ),
                                 items: [ ['Scegli un formato'], ],
                                 'default': 'Scegli un formato',
                                 setup: function( element ) {
                                     format = element.getAttribute("data-format");
                                     this.setValue(format);
                                 },
                                 commit: function( element ) {
                                     element.setAttribute( "data-format", this.getValue() );
                                 },
                                 onChange: function(){
                                    var jQuery = django.jQuery, $ = jQuery;
                                    $.ajax({
                                        url : '/mediamanager/addmedia/',
                                        dataType : 'json',
                                        type : 'POST',
                                        param: {
                                            type: 'image',
                                            format: this.getValue(),
                                            media_id: this.getContentElement("tab-my-img","pk").getValue(),
                                            esercizio_id: window.esercizio_id
                                            }
                                        success: function(data) {
                                            this.getContentElement("tab-my-img","srcdef").setValue(data)
                                        },
                                        error:function (xhr, textStatus, thrownError){
                                            error(xhr, textStatus, thrownError);
                                        }
                                    });
                                     
                                 }
                             },
                            {
                                type: 'text',
                                id: 'srcdef',
                                label: 'Immagine',
                                labelLayout: 'vertical',
                                validate: CKEDITOR.dialog.validate.notEmpty( "Errore: il campo non può essere vuoto" ),
                                setup: function( element ) {
                                    src = element.getAttribute( "src" ).replace("/files/", "")
                                    this.setValue( src );
                                },
                                commit: function( element ) {
                                    element.setAttribute( "src", "/files/" + this.getValue() );
                                }
                            }
                        ]
                    }
                ]

            }
        ],
        onLoad: function() {
            this.getContentElement("tab-my-img","src").disable();
            this.getContentElement("tab-my-img","pk").disable();
            this.getContentElement("tab-my-img","srcdef").disable();
            this.getContentElement("tab-my-img","format").add(label);
        },
        onShow: function() {
            var jQuery = django.jQuery, $ = jQuery;
            $( "#myImagesDiv" ).empty();
            $.ajax({
                url : '/mediamanager/myimagecall/',
                dataType : 'json',
                type : 'GET',
                success: function(data) {
                    $.each(data, function(i, item) {
                        $( "#myImagesDiv" ).append( '<a href="#" onclick=\'CKEDITOR.dialog.getCurrent().getContentElement("tab-my-img","src").setValue("' + data[i].fields.image + '"); CKEDITOR.dialog.getCurrent().getContentElement("tab-my-img","pk").setValue(' + data[i].pk + '); \'><div style="white-space: normal !important;width:135px;height:135px;display:inline-block;margin-right: 10px;" id="image_' + data[i].pk + '"><img src="/image/' + data[i].fields.image + '" style="width: 135px;"/><p>' + data[i].fields.title +' </p></div></a>' );
                    });
                },
                error:function (xhr, textStatus, thrownError){
                    error(xhr, textStatus, thrownError);
                }
            });
            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if ( element )
                element = element.getAscendant( 'img', true );

            if ( !element || element.getName() != 'img' ) {
                    element = editor.document.createElement( 'img' );
                    this.insertMode = true;
            }
            else
                this.insertMode = false;

            this.element = element;

            if ( !this.insertMode )
                this.setupContent( element );
        },

        onOk: function() {

            var dialog = this,
                images = dialog.element;
            dialog.commitContent( images );

            if ( dialog.insertMode )
                editor.insertElement( images );
        }
    };
});
