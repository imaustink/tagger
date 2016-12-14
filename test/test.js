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
            tagger.addTag('foo');
            expect(tagger.getValues()).to.contain('foo');
        });

        it('should add multiple tags', function(){
            tagger.add(['bar', 'baz', 'qux']);
            expect(tagger.getValues()).to.eql(['foo', 'bar', 'baz', 'qux']);
        });
        
        it('should remove baz by index', function(){
            tagger.removeIndex(2);
            expect(tagger.getValues()).to.not.include('baz');
        });
        
        it('should remove the last tag', function(){
            tagger.removeLast();
            expect(tagger.exists('baz')).to.be.false;
        });
        
        it('should remove all tags', function(){
            var tags = tagger.siblings('.label');
            tagger.remove(tags);
            expect(tagger.getValues()).to.have.lengthOf(0);
        });
        
    });
    
})(chai.expect, describe, it, this);