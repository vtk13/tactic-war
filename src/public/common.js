$(function() {
    $('a[confirm]').click(function() {
        return confirm($(this).attr('confirm'));
    });

    $('.code').each(function() {
        CodeMirror.runMode($(this).addClass('cm-s-default').text(), "javascript", this);
    });
});