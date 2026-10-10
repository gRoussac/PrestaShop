/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

$(function()
{
	$('#mainForm').on('click', 'input[type="submit"]', function() {
		$('#mainForm').data('submitName', this.name);
	});

	$('#mainForm').on('submit', function(e) {
		var submitName = $('#mainForm').data('submitName')
			|| (e.originalEvent && e.originalEvent.submitter && e.originalEvent.submitter.name)
			|| '';
		// Only hide Next when moving forward; Back must not strand the footer.
		if (submitName !== 'submitPrevious') {
			$('#btNext').hide();
		}
	});

	// Ajax animation
	$("#loaderSpace").ajaxStart(function()
	{
		$(this).fadeIn('slow');
		$(this).children('div').fadeIn('slow');
	});

	$("#loaderSpace").ajaxComplete(function(e, xhr, settings)
	{
		$(this).fadeOut('slow');
		$(this).children('div').fadeOut('slow');
	});

	$('select.chosen').not('.no-chosen').chosen();
});
