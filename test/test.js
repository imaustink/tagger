(function(expect, describe, it, window) {
    var container = $(window.__html__['tests/tagger.html']);
    var input;
    
    describe('.tagger() ', function(){
        
        it('should init tagger', function(){
            input = container.find('#Tags').tagger();
        });
        
        it('should have a tag', function(){
            var vals = input.tagger('getValues');
            console.log(vals);
            expect(vals).to.contain('starting');
        });
        
        it('should remove a tag', function(){
            input.tagger('removeValue', 'starting');
            expect(input.tagger('getValues')).to.have.lengthOf(0);
        });
        
        it('should add a tags', function(){
            input.tagger('add', 'foo');
            expect(input.tagger('getValues')).to.contain('foo');
        });

        it('should add multiple tags', function(){
            input.tagger('add', ['bar', 'baz', 'qux']);
            expect(input.tagger('getValues')).to.eql(['foo', 'bar', 'baz', 'qux']);
        });
        
        it('should remove baz by index', function(){
            input.tagger('removeIndex', 2);
            expect(input.tagger('getValues')).to.not.include('baz');
        });
        
        it('should remove the last tag', function(){
            input.tagger('removeLast');
            expect(input.tagger('exits', 'baz')).to.be.false;
        });
        
        it('should remove all tags', function(){
            var tags = input.siblings('.label');
            input.tagger('remove', tags);
            expect(input.tagger('getValues')).to.have.lengthOf(0);
        });
        
    });
    
})(chai.expect, describe, it, this);