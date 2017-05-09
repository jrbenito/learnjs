describe('LearnJS', function() {

    it('invokes the router when loaded', function() {
        spyOn(learnjs,'showView');
        learnjs.appOnReady();
        expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
    });

    it('can show a problem view', function() {
        learnjs.showView('#problem-1');
        expect($('.view-container .problem-view').length).toEqual(1);
    });

    it('shows the landing page view when there is no hash', function() {
        learnjs.showView('');
        expect($('.view-container .landing-view').length).toEqual(1);
    });

    it('passes the hash view parameters to the view function', function() {
        spyOn(learnjs,'problemView');
        learnjs.showView('#problem-42');
        expect(learnjs.problemView).toHaveBeenCalledWith('42');
    });

    it('subscribes to the hash change event', function() {
        learnjs.appOnReady();
        spyOn(learnjs, 'showView');
        $(window).trigger('hashchange');
        expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
    });

    it('can flash an element while setting the text', function() {
        var elem = $('<p>');
        spyOn(elem, 'fadeOut').and.callThrough();
        spyOn(elem, 'fadeIn');
        learnjs.flashElement(elem, "new text");
        expect(elem.text()).toEqual("new text");
        expect(elem.fadeOut).toHaveBeenCalled();
        expect(elem.fadeIn).toHaveBeenCalled();
    });

    describe('problem view', function(){
        var view;
        beforeEach(function() {
            view = learnjs.problemView('1');
        });

        it('has a title that includes the problem number', function() {
            expect(view.find('.title').text()).toEqual('Problem #1');
        });

        it('shows the description', function() {
            expect(view.find('[data-name="description"]').text()).toEqual('What is truth?');
        });

        it('shows the problem code', function() {
            expect(view.find('[data-name="code"]').text()).toEqual('function problem() { return ___;}');
        });

        describe('answer section', function() {
            var resultFlash;

            beforeEach(function() {
                spyOn(learnjs, 'flashElement');
                resultFlash = view.find('.result');
            });

            it('can check a correct answer by hitting a button', function() {
                view.find('.answer').val('true');
                view.find('.check-btn').click();
                expect(learnjs.flashElement).toHaveBeenCalledWith(resultFlash, 'Correct!');
            });

            it('rejects an incorrect answer', function() {
                view.find('.answer').val('false');
                view.find('.check-btn').click();
                expect(learnjs.flashElement).toHaveBeenCalledWith(resultFlash, 'Incorrect!');
            });
        });
    });
});
