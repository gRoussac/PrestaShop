/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

var DATABASE_DRAFT_KEY = 'gregoshop.install.database';

function loadDatabaseDraft() {
	try {
		return JSON.parse(localStorage.getItem(DATABASE_DRAFT_KEY) || '{}') || {};
	} catch (e) {
		return {};
	}
}

function saveDatabaseDraft(partial) {
	try {
		var draft = $.extend({}, loadDatabaseDraft(), partial || {});
		// Never persist DB password in localStorage.
		delete draft.dbPassword;
		localStorage.setItem(DATABASE_DRAFT_KEY, JSON.stringify(draft));
	} catch (e) {
		// Ignore quota / private mode.
	}
}

function collectDatabaseDraft() {
	return {
		dbServer: $('#dbServer').val(),
		dbName: $('#dbName').val(),
		dbLogin: $('#dbLogin').val(),
		db_prefix: $('#db_prefix').val(),
		db_clear: $('#db_clear').prop('checked'),
	};
}

function restoreDatabaseDraft() {
	var draft = loadDatabaseDraft();
	if (!draft || !Object.keys(draft).length) {
		return;
	}
	['dbServer', 'dbName', 'dbLogin', 'db_prefix'].forEach(function(id) {
		var $el = $('#' + id);
		if ($el.length && !$el.val() && draft[id]) {
			$el.val(draft[id]);
		}
	});
	if (typeof draft.db_clear !== 'undefined') {
		$('#db_clear').prop('checked', !!draft.db_clear);
	}
}

function bindDatabaseDraftPersistence() {
	var persist = function() {
		saveDatabaseDraft(collectDatabaseDraft());
	};
	$('#mainForm').on('input change keyup paste', 'input', persist);
	$(window).on('beforeunload', persist);
}

$(function()
{
	restoreDatabaseDraft();
	bindDatabaseDraftPersistence();
	saveDatabaseDraft(collectDatabaseDraft());

	// Check rewrite engine availability
	$.ajax({
		url: 'sandbox/anything.php',
		success: function(value) {
			$('#rewrite_engine').val(1);
		}
	});

	// Check database configuration
	$('#btTestDB').on('click', function()
	{
		$("#dbResultCheck")
			.removeClass('errorBlock')
			.removeClass('okBlock')
			.addClass('waitBlock')
			.html('&nbsp;')
			.slideDown('slow');
		$.ajax({
			url: 'index.php',
			data: {
                'checkDb': 'true',
                'dbServer': $('#dbServer').val(),
                'dbName': $('#dbName').val(),
                'dbLogin': $('#dbLogin').val(),
                'dbPassword': $('#dbPassword').val(),
                'dbEngine': $('#dbEngine').val(),
                'db_prefix': $('#db_prefix').val(),
                'clear': $('#db_clear').prop('checked') ? '1' : '0'
            },
			dataType: 'json',
			cache: false,
			success: function(json)
			{
				$("#dbResultCheck")
					.addClass((json.success) ? 'okBlock' : 'errorBlock')
					.removeClass('waitBlock')
					.removeClass((json.success) ? 'errorBlock' : 'okBlock')
					.html(json.message)
			},
            error: function(xhr)
            {
            	var str = xhr.responseText || '';
            	var isHtml = /<[a-z][\s\S]*>/i.test(str);
            	var detail = isHtml
            		? ('HTTP ' + xhr.status + ': expected JSON, got HTML (' + str.length + ' bytes). First chars: '
            			+ $('<div>').text(str.replace(/\s+/g, ' ').slice(0, 180)).html())
            		: str;

                $("#dbResultCheck")
                    .addClass('errorBlock')
					.removeClass('waitBlock')
                    .removeClass('okBlock')
                    .html('An error occurred:<br /><br />' + detail)
            }
		});
	});
});

function bindCreateDB()
{
	// Attempt to create the database
	$('#btCreateDB').on('click', function()
	{
		$("#dbResultCheck").slideUp('fast');
		$.ajax({
			url: 'index.php',
			data: {
                'createDb': 'true',
                'dbServer': $('#dbServer').val(),
                'dbName': $('#dbName').val(),
                'dbLogin': $('#dbLogin').val(),
                'dbPassword': $('#dbPassword').val()
            },
			dataType: 'json',
			cache: false,
			success: function(json)
			{
				$("#dbResultCheck")
					.addClass((json.success) ? 'okBlock' : 'errorBlock')
					.removeClass((json.success) ? 'errorBlock' : 'okBlock')
					.html(json.message)
					.slideDown('slow');
			},
            error: function(xhr)
            {
                $("#dbResultCheck")
                    .addClass('errorBlock')
                    .removeClass('okBlock')
                    .html('An error occurred:<br /><br />' + xhr.responseText)
                    .slideDown('slow');
            }
		});
	});
}
