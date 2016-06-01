(function(expect, describe, it, window) {
    var container = $(window.__html__['tests/tagger.html']);
    var tagger;
    
    describe('.tagger() ', function(){
        
        it('should init tagger', function(){
            tagger = container.find('#Tags').tagger();
        });
        
        it('should have a tag', function(){
            expect(tagger.getValues()).to.contain('starting');
        });
        
        it('should remove a tag', function(){
            tagger.removeValue('starting');
            expect(tagger.getValues()).to.have.lengthOf(0);
        });
        
        it('should add a tags', function(){
            tagger.add('foo');
            expect(tagger.getValues()).to.contain('foo');
        });

        it('should add multiple tags', function(){
            tagger.add(['bar', 'baz']);
            expect(tagger.getValues()).to.eql(['foo', 'bar', 'baz']);
        });
        
    });
    
})(chai.expect, describe, it, this);