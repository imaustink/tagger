(function(expect, describe, it, window) {
    var container = $(window.__html__['tagger.html']);
    var tagger;
    
    describe('should init', function(){
        it('should init tagger', function(){
            tagger = container.find('#Tags').tagger();
            tagger.add('test');
        });
        
        it('should have a tag', function(){
            console.log(tagger);
            expect(tagger.getValues()).to.contain('starting');
        });
    });
    
})(chai.expect, describe, it, this);