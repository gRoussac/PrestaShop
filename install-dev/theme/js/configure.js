/**
 * For the full copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

// Initialize zxcvbn-ts with language packages
(function() {
  if (typeof zxcvbnts !== 'undefined' && zxcvbnts.core && zxcvbnts['language-common'] && zxcvbnts['language-en']) {
    const options = {
      translations: zxcvbnts['language-en'].translations,
      graphs: zxcvbnts['language-common'].adjacencyGraphs,
      dictionary: {
        ...zxcvbnts['language-common'].dictionary,
        ...zxcvbnts['language-en'].dictionary,
      },
    };
    zxcvbnts.core.zxcvbnOptions.setOptions(options);
    // Create global zxcvbn function for backward compatibility
    window.zxcvbn = function(password) {
      return zxcvbnts.core.zxcvbn(password);
    };
  }
})();

$(function() {
  restoreConfigureDraft();
  bindConfigureDraftPersistence();

  // Only auto-pick timezone from country when none is set yet (session or draft).
  if (!$('#infosTimezone').val() || $('#infosTimezone').val() === '0') {
    checkTimeZone($('#infosCountry'));
  }
  // When a country is changed
  $('#infosCountry').on('change', function()
	{
	  checkTimeZone(this);
  });

  watchPasswordStrength($('#infosPassword'), '#btNext');
  if ($('#infosPassword').val()) {
    $('#infosPassword').trigger('keyup');
  }

  // Safety net: prevent submit (e.g. via Enter key) when password does not meet requirements.
  // The button is already disabled by watchPasswordStrength, but Enter key can bypass that.
  $('#mainForm').on('submit', function(e) {
    const $passwordInput = $('#infosPassword');
    if ($passwordInput.length === 0 || !$passwordInput.val()) {
      return;
    }
    if (!isPasswordInputValid($passwordInput)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }
  });
});

const CONFIGURE_DRAFT_KEY = 'gregoshop.install.configure';

function loadConfigureDraft() {
  try {
    return JSON.parse(localStorage.getItem(CONFIGURE_DRAFT_KEY) || '{}') || {};
  } catch (e) {
    return {};
  }
}

function saveConfigureDraft(partial) {
  try {
    localStorage.setItem(
      CONFIGURE_DRAFT_KEY,
      JSON.stringify(Object.assign(loadConfigureDraft(), partial)),
    );
  } catch (e) {
    // Ignore quota / private mode.
  }
}

function isBlankInstallValue(value) {
  return value === null || value === undefined || value === '' || value === '0';
}

function restoreConfigureDraft() {
  const draft = loadConfigureDraft();
  if (!draft || Object.keys(draft).length === 0) {
    return;
  }

  const textFields = {
    infosShop: 'shop_name',
    infosFirstname: 'admin_firstname',
    infosName: 'admin_lastname',
    infosEmail: 'admin_email',
    infosPassword: 'admin_password',
    infosPasswordRepeat: 'admin_password_confirm',
  };

  Object.keys(textFields).forEach(function(id) {
    const $el = $('#' + id);
    if ($el.length && isBlankInstallValue($el.val()) && !isBlankInstallValue(draft[textFields[id]])) {
      $el.val(draft[textFields[id]]);
    }
  });

  const $country = $('#infosCountry');
  if ($country.length && isBlankInstallValue($country.val()) && draft.shop_country) {
    $country.val(draft.shop_country).trigger('liszt:updated').trigger('chosen:updated');
  }

  const $timezone = $('#infosTimezone');
  if ($timezone.length && !isBlankInstallValue(draft.shop_timezone)) {
    if (isBlankInstallValue($timezone.val()) || $timezone.val() === '0') {
      $timezone.val(draft.shop_timezone).trigger('liszt:updated').trigger('chosen:updated');
    }
    if (in_array($country.val(), ['br', 'us', 'ca', 'ru', 'me', 'au', 'id'])) {
      $('#timezone_div').show();
    }
  }

  if (typeof draft.enable_ssl !== 'undefined') {
    $('input[name="enable_ssl"][value="' + (draft.enable_ssl ? '1' : '0') + '"]').prop('checked', true);
  }
}

function bindConfigureDraftPersistence() {
  const persist = function() {
    saveConfigureDraft({
      shop_name: $('#infosShop').val(),
      shop_country: $('#infosCountry').val(),
      shop_timezone: $('#infosTimezone').val(),
      enable_ssl: $('input[name="enable_ssl"]:checked').val() === '1',
      admin_firstname: $('#infosFirstname').val(),
      admin_lastname: $('#infosName').val(),
      admin_email: $('#infosEmail').val(),
      admin_password: $('#infosPassword').val(),
      admin_password_confirm: $('#infosPasswordRepeat').val(),
    });
  };

  $('#infosShopBlock').on(
    'input change',
    'input, select',
    persist,
  );
}

function checkTimeZone(elt)
{
  var iso = $(elt).val();

  // Get timezone by iso
  $.ajax({
	url: 'index.php',
	data: 'timezoneByIso=true&iso='+iso,
	dataType: 'json',
	cache: true,
	success: function(json) {
	  if (json.success) {
		$('#infosTimezone').val(json.message).trigger("liszt:updated");
		if (in_array(iso, ['br','us','ca','ru','me','au','id']))
		{
		  if ($('#infosTimezone:visible').length == 0 && $('#infosTimezone_chosen').length == 0)
		  {
			$('#infosTimezone:hidden').show();
			$('#timezone_div').show();
			$('#infosTimezone').chosen();
		  }
		  $('#timezone_div').show();
		}
		else
		  $('#timezone_div').hide();
	  }
	}
  });
}

function in_array(needle, haystack) {
  var length = haystack.length;
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle)
	  return true;
  }
  return false;
}

/**
 * Check whether the password in $input meets the minimum score and length requirements
 * declared via data-minscore, data-minlength, data-maxlength attributes.
 *
 * @param {jQuery} $input the password input element.
 * @returns {boolean}
 */
function isPasswordInputValid($input) {
  const passwordValue = $input.val();
  if (!passwordValue) {
    return false;
  }
  const result = zxcvbn(passwordValue);
  const minScore = $input.data('minscore');
  const minLength = $input.data('minlength');
  const maxLength = $input.data('maxlength');
  return result.score >= minScore
    && passwordValue.length >= minLength
    && passwordValue.length <= maxLength;
}

/**
 * Watch password, which is entered in the input, strength and inform about it.
 * When submitButtonSelector is provided, also disables the submit button when password
 * does not meet minimum strength or length, and shows the error message in the feedback area.
 *
 * @param {jQuery} element the input to watch.
 * @param {string} [submitButtonSelector] optional selector for the form submit button to disable when password is invalid.
 */
function watchPasswordStrength(element, submitButtonSelector) {
  element.on('keyup', function checkPasswordStrength() {
    const $passwordInput = $(this);
    const $fieldPassword = $passwordInput.closest('.field-password');
    $fieldPassword.find('.js-password-client-error').hide();
    const passwordValue = $passwordInput.val();
    const popoverElement = $('.field-password .popover');
    let $feedbackContainer = $passwordInput.parent().find('.password-strength-feedback');

    if ($feedbackContainer.length === 0) {
      $passwordInput.parent().append($('#password-feedback').html());
      $feedbackContainer = $passwordInput.parent().find('.password-strength-feedback');
    }

    const passwordRequirementsLength = $feedbackContainer.find('.password-requirements-length');
    passwordRequirementsLength.find('span').text(
      sprintf(
        passwordRequirementsLength.data('translation'),
        $passwordInput.data('minlength'),
        $passwordInput.data('maxlength'),
      ),
    );

    const passwordRequirementsScore = $feedbackContainer.find('.password-requirements-score');
    passwordRequirementsScore.find('span').text(
      sprintf(
        passwordRequirementsScore.data('translation'),
        $feedbackContainer.data('translations')[$passwordInput.data('minscore')],
      ),
    );

    if (passwordValue === '') {
      $feedbackContainer.toggleClass('d-none', true);
      popoverElement.toggleClass('d-none', true);
      if (submitButtonSelector) {
        $(submitButtonSelector).prop('disabled', false);
      }
    } else {
      const result = zxcvbn(passwordValue);
      displayFeedback($passwordInput, $feedbackContainer, result);
      $feedbackContainer.removeClass('d-none');

      const isValid = isPasswordInputValid($passwordInput);

      if (submitButtonSelector) {
        $(submitButtonSelector).prop('disabled', !isValid);
      }
      if (!isValid) {
        const errorMessage = $fieldPassword.data('passwordMustBeStrong')
          || 'The password must be strong (see requirements above).';
        $fieldPassword.find('.js-password-client-error').show().text(errorMessage);
      }
    }
  });
}

/**
 * Display feedback about password's strength.
 *
 * @param {jQuery} $passwordInput The currenct password field
 * @param {jQuery} $outputContainer a container to put feedback output into.
 * @param {ZXCVBNResult} result
 *
 * @private
 */
function displayFeedback(
  $passwordInput,
  $outputContainer,
  result,
) {
  const feedback = getPasswordStrengthFeedback(result.score);
  const translations = $outputContainer.data('translations');
  const popoverContent = [];
  const popoverElement = $('.field-password .popover');
  const popoverBody = $('.popover-body', popoverElement);

  $outputContainer.find('.password-strength-text').text(translations[result.score]);

  if (result.feedback.warning !== '') {
    if (result.feedback.warning in translations) {
      popoverContent.push(translations[result.feedback.warning]);
    }
  }

  result.feedback.suggestions.forEach((suggestion) => {
    if (suggestion in translations) {
      popoverContent.push(translations[suggestion]);
    }
  });

  popoverBody.html(popoverContent.join('<br>'));

  const passwordLength = $passwordInput.val().length;

  popoverElement.toggleClass('d-none', popoverContent.length <= 0);

  const passwordLengthValid = passwordLength >= $passwordInput.data('minlength')
    && passwordLength <= $passwordInput.data('maxlength');
  $outputContainer.find('.password-requirements-length svg').toggleClass(
    'text-success',
    passwordLengthValid,
  );

  const passwordScoreValid = $passwordInput.data('minscore') <= result.score;
  $outputContainer.find('.password-requirements-score svg').toggleClass(
    'text-success',
    passwordScoreValid,
  );

  $passwordInput
    .removeClass()
    .addClass(passwordScoreValid && passwordLengthValid ? 'border-success' : 'border-danger')
    .addClass('form-control border');

  // Calculate the pourcentage of the bar, depending on the score.
  const percentage = (result.score * 20) + 20;

  // increase and decrease progress bar
  $outputContainer
    .find('.progress-bar')
    .width(`${percentage}%`)
    .css('visibility', 'visible')
    .css('background-color', feedback.color);
}

/**
 * Get feedback that describes given password strength.
 * Response contains text message and element class.
 *
 * @param {number} strength
 *
 * @private
 */
function getPasswordStrengthFeedback(
  strength
) {
  switch (strength) {
  case 0:
    return {
      color: '#BA151A',
    };

  case 1:
    return {
      color: '#BA151A',
    };

  case 2:
    return {
      color: '#FFA000',
    };

  case 3:
    return {
      color: '#207F4B',
    };

  case 4:
    return {
      color: '#207F4B',
    };

  default:
    throw new Error('Invalid password strength indicator.');
  }
}
