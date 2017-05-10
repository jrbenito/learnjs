'use strict'
var learnjs = {
    poolId: 'us-east-1:442b421d-9882-47e5-8a7f-5444fd92662a'
};

learnjs.problems = [
    {
        description: "What is truth?",
        code: "function problem() { return ___;}"
    },
    {
        description: "Simple Math",
        code: "function problem() { return 42 === 6 * ___;}"
    }
];

learnjs.triggerEvent = function(name, args) {
    $('.view-container>*').trigger(name, args);
}

learnjs.flashElement = function(elem, content) {
    elem.fadeOut('fast',function() {
        elem.html(content);
        elem.fadeIn();
    });
}

learnjs.applyObject = function(obj, elem) {
    for(var key in obj) {
        elem.find('[data-name="' + key + '"]').text(obj[key]);
    }
};

learnjs.template = function(name) {
    return $('.templates .' + name).clone();
}

learnjs.buildCorrectFlash = function (problemNum) {
    var correctFlash = learnjs.template('correct-flash');
    var link = correctFlash.find('a');

    if (problemNum < learnjs.problems.length) {
        link.attr('href', '#problem-' + (problemNum + 1));
    } else {
        link.attr('href','');
        link.text("You´re Finished!");
    }

    return correctFlash;
}

learnjs.problemView = function(data) {
    var problemNumber = parseInt(data, 10);
    var view = learnjs.template('problem-view');
    var problemData = learnjs.problems[problemNumber - 1];
    var resultFlash = view.find('.result');

    function checkAnswer() {
        var answer = view.find('.answer').val();
        var test = problemData.code.replace('___', answer) + '; problem();';
        return eval(test);
    }
    
    function checkAnswerClick() {
        if (checkAnswer()) {
            var flashContent = learnjs.buildCorrectFlash(problemNumber);
            learnjs.flashElement(resultFlash, flashContent);
        } else {
            learnjs.flashElement(resultFlash, 'Incorrect!');
        }
        
        return false;
    }

    if (problemNumber < learnjs.problems.length) {
        var buttonItem = learnjs.template('skip-btn');
        buttonItem.find('a').attr('href', '#problem-' + (problemNumber + 1));
        $('.nav-list').append(buttonItem);
        view.bind('removingView', function() {
            buttonItem.remove();
        });
    }

    view.find('.check-btn').click(checkAnswerClick);
    view.find('.title').text('Problem #'+problemNumber);
    learnjs.applyObject(problemData, view);
    return view;
}

learnjs.landingView = function() {
    return learnjs.template('landing-view');
}

learnjs.showView = function(hash) {
    var routes = {
        '#problem': learnjs.problemView,
        '#': learnjs.landingView,
        '': learnjs.landingView
    };

    var hashParts = hash.split('-');
    var viewFn = routes[hashParts[0]];

    if (viewFn) {
        learnjs.triggerEvent('removingView', []);
        $('.view-container').empty().append(viewFn(hashParts[1]));
    }
}

learnjs.appOnReady = function() {
    window.onhashchange = function() {
        learnjs.showView(window.location.hash);
    };

    learnjs.showView(window.location.hash);
}

function googleSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    AWS.config.update({
        region: 'us-east-1',
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: learnjs.poolId,
            Logins: {
                'accounts.google.com': id_token
            }
        })
    })
}
