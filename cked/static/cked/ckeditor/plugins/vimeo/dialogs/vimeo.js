CKEDITOR.dialog.add( 'vimeoDialog', function ( editor ) {
    return {
        title: 'Vimeo',
        minWidth: 600,
        minHeight: 300,

        contents: [
            {
                id: 'tab-my-vid',
                label: 'I Miei Video',
                elements: [
                    {
                        type: 'html',
                        id: 'my-vid',
                        label: 'I miei Video',
                        html: '<div id="box" style="border-bottom: 1px solid #eee;"><div id="myVideoDiv"></div></div>',
                    },
                    {
                        type: 'button',
                        id: 'carica',
                        label: 'Carica un video',
                        title: 'Carica',
                        onClick: function() {
                            var NWin = window.open('/vimeo/importvideo/', '', 'height=800,width=800');
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
                                label: 'Video',
                                labelLayout: 'vertical',
                                validate: CKEDITOR.dialog.validate.notEmpty( "Errore" ),
                                setup: function( element ) {
                                    this.setValue( element.getAttribute( "data-id" ) );
                                },
                                commit: function( element ) {
                                    element.setAttribute( "src", 'http://player.vimeo.com/video/' + this.getValue() + '?api=1&player_id=vimeoplayer' );
                                    element.setAttribute( "frameborder", 0 );
                                    element.setAttribute( "webkitallowfullscreen", '' );
                                    element.setAttribute( "mozallowfullscreen", '' );
                                    element.setAttribute( "allowfullscreen", '' );
                                    element.setAttribute( "id", 'vimeoplayer' );
                                    element.setAttribute( "data-vimeo", 'true' );
                                    element.setAttribute( "data-id", this.getValue())
                                }
                            }
                        ]
                    },
                    {
                        type: 'select',
                        id: 'dim',
                        label: 'Dimension',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Errore" ),
                        items: [ [ 'Low', '600,400' ] ],
                        'default': '600,400',
                        setup: function( element ) {
                            height = element.getAttribute( "height" );
                            width = element.getAttribute( "width" );
                            dimension = width + ',' + height
                            this.setValue(dimension);
                        },
                        commit: function( element ) {
                            dimension = this.getValue().split(",");
                            element.setAttribute( "width", dimension[0] );
                            element.setAttribute( "height", dimension[1] );
                        }
                    },
                    {
                        type: 'text',
                        id: 'seek',
                        label: 'SeekTo',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Errore" ),
                        'default': '0',
                        onChange: function( api ) {
                            var time = this.getValue();
                       
                            var h = Math.floor(time / 3600);
                            time = time - h * 3600;
                            var m = Math.floor(time / 60);
                            var s = time - m * 60;

                            place = CKEDITOR.dialog.getCurrent().getContentElement("tab-my-vid","seek");
                            place.setLabel("SeekTo: " + h +'.'+ m +'.'+ s );
                        },
                        setup: function( element ) {
                            place = CKEDITOR.dialog.getCurrent().getContentElement("tab-my-vid","seek").getInputElement();
                            place.setAttribute("max", element.getAttribute( "data-max" ));
                            this.setValue( element.getAttribute( "data-seek" ) );
                        },
                        commit: function( element ) {
                            place = CKEDITOR.dialog.getCurrent().getContentElement("tab-my-vid","seek").getInputElement();
                            dur_max = place.getAttribute("max");
                            element.setAttribute( "data-seek", this.getValue() );
                            element.setAttribute( "data-max", dur_max );
                        }
                    }

                ]

            }
        ],
        onLoad: function() {
            this.getContentElement("tab-my-vid","src").disable();
            this.getContentElement("tab-my-vid","pk").disable();
            seek_range = this.getContentElement("tab-my-vid","seek").getInputElement();  
            seek_range.setAttribute("type", "range");
            seek_range.setAttribute("min", 0);
            seek_range.setAttribute("max", 10);
        },
        onShow: function() {
            var jQuery = django.jQuery, $ = jQuery;
            $( "#myVideoDiv" ).empty();
            $.ajax({
                url : '/vimeo/myvideocall/',
                dataType : 'json',
                type : 'GET',
                success: function(data) {
                    $.each(data, function(i, item) {
                        $( "#myVideoDiv" ).append( '<a href="#" onclick=\'CKEDITOR.dialog.getCurrent().getContentElement("tab-my-vid","src").setValue(' + data[i].fields.vimeo_id + '); CKEDITOR.dialog.getCurrent().getContentElement("tab-my-vid","pk").setValue(' + data[i].pk + '); CKEDITOR.dialog.getCurrent().getContentElement("tab-my-vid","seek").getInputElement().setAttribute("max", '+ data[i].fields.duration +'); \'><div style="white-space: normal !important;width:135px;height:135px;display:inline-block;margin-right: 10px;" id="video_' + data[i].pk + '"><img src="' + data[i].fields.thumb + '" style="width: 135px;"/><p>' + data[i].fields.title +' </p></div></a>' );
                    });
                },
                error:function (xhr, textStatus, thrownError){
                    error(xhr, textStatus, thrownError);
                }
            });
            var selection = editor.getSelection();
            var element = selection.getStartElement();
            iframe = editor.document.$.getElementsByTagName('iframe')[0]

            if ( element )
                element = element.getAscendant( 'iframe', true );

            if ( !element || element.getName() != 'iframe' ) {
                if (iframe){
                    element = iframe;
                    this.insertMode = false;
                }
                else {
                    element = editor.document.createElement( 'iframe' );
                    this.insertMode = true;
                }
            }
            else
                this.insertMode = false;

            this.element = element;

            if ( !this.insertMode )
                this.setupContent( element );
        },

        onOk: function() {

            var dialog = this,
                vimeo = dialog.element;
            dialog.commitContent( vimeo );

            if ( dialog.insertMode )
                editor.insertElement( vimeo );
        }
    };
});
