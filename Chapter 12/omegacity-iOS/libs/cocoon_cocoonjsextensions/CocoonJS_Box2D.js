/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, devel:true, indent:4, maxerr:50 */

if ( !window.ext || typeof window.ext.IDTK_SRV_BOX2D === 'undefined' ){
    console.log("The CocoonJS binding for Box2D has been ignored because ext.IDTK_SRV_BOX2D is not available");   
}else{
    // Load our binding
    window.Box2D                  = {};
    window.Box2D.Dynamics         = {};
    window.Box2D.Dynamics.Joints  = {};
    window.Box2D.Common           = {};
    window.Box2D.Common.Math      = {};
    window.Box2D.Collision        = {};
    window.Box2D.Collision.Shapes = {};

    (function (){
        "use strict";

        function b2Err(msg) {
            console.error( msg );
        }

        // ***************************************************************************
        //                                 b2Vec2
        // ***************************************************************************

        var B2Vec2 = function (x_, y_) {
            if (x_ === undefined){x_ = 0;}
            if (y_ === undefined){y_ = 0;}
            this.x = x_;
            this.y = y_;
        };
   
        window.Box2D.Common.Math.b2Vec2 = B2Vec2;

        B2Vec2.prototype.SetZero = function () {
            this.x = 0.0;
            this.y = 0.0;
        };

        B2Vec2.prototype.Set = function (x_, y_) {
            if (x_ === undefined){x_ = 0;}
            if (y_ === undefined){y_ = 0;}
            this.x = x_;
            this.y = y_;
        };
   
        B2Vec2.prototype.SetV = function (v) {
            if( v === undefined ){
                b2Err("undefined 'v' in b2Vec2.SetV");
            }
            this.x = v.x;
            this.y = v.y;
        };

        B2Vec2.Make = function (x_, y_) {
            if (x_ === undefined){x_ = 0;}
            if (y_ === undefined){y_ = 0;}
            return new B2Vec2(x_, y_);
        };

        B2Vec2.prototype.Copy = function () {
            return new B2Vec2(this.x, this.y);
        };

        B2Vec2.prototype.Add = function (v) {
            if( v === undefined ){
                b2Err("undefined 'v' in b2Vec2.Add");
            }
            this.x += v.x;
            this.y += v.y;
        };

        B2Vec2.prototype.Subtract = function (v) {
            if( v === undefined ){
                b2Err("undefined 'v' in b2Vec2.Subtract");
            }

            this.x -= v.x;
            this.y -= v.y;
        };

        B2Vec2.prototype.Multiply = function (a) {
            if (a === undefined){
                a = 0;
            }
            this.x *= a;
            this.y *= a;
        };

        B2Vec2.prototype.Length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        };

        B2Vec2.prototype.LengthSquared = function () {
            return (this.x * this.x + this.y * this.y);
        };

        B2Vec2.prototype.Normalize = function () {
            var length = Math.sqrt(this.x * this.x + this.y * this.y);
            if (length < Number.MIN_VALUE) {
                return 0.0;
            }
            var invLength = 1.0 / length;
            this.x *= invLength;
            this.y *= invLength;
            return length;
        };

        // ***************************************************************************
        //                                 b2Mat22
        // ***************************************************************************

        var B2Mat22 = function () {
            this.col1 = new B2Vec2();
            this.col2 = new B2Vec2();
            this.SetIdentity();
        };

        window.Box2D.Common.Math.b2Mat22 = B2Mat22 ;

        B2Mat22.FromAngle = function (angle) {
            if (angle === undefined){
                angle = 0;
            }
            var mat = new B2Mat22();
            mat.Set(angle);
            return mat;
        };

        B2Mat22.FromVV = function (c1, c2) {
            var mat = new B2Mat22();
            mat.SetVV(c1, c2);
            return mat;
        };
       
        B2Mat22.prototype.Set = function (angle) {
            if (angle === undefined){
                angle = 0;
            }
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            this.col1.x = c;
            this.col2.x = (-s);
            this.col1.y = s;
            this.col2.y = c;
        };

        B2Mat22.prototype.SetVV = function (c1, c2) {
            this.col1.SetV(c1);
            this.col2.SetV(c2);
        };
       
        B2Mat22.prototype.Copy = function () {
            var mat = new B2Mat22();
            mat.SetM(this);
            return mat;
        };
       
        B2Mat22.prototype.SetM = function (m) {
            this.col1.SetV(m.col1);
            this.col2.SetV(m.col2);
        };
       
        B2Mat22.prototype.AddM = function (m) {
            this.col1.x += m.col1.x;
            this.col1.y += m.col1.y;
            this.col2.x += m.col2.x;
            this.col2.y += m.col2.y;
        };
       
        B2Mat22.prototype.SetIdentity = function () {
            this.col1.x = 1.0;
            this.col2.x = 0.0;
            this.col1.y = 0.0;
            this.col2.y = 1.0;
        };
       
        B2Mat22.prototype.SetZero = function () {
            this.col1.x = 0.0;
            this.col2.x = 0.0;
            this.col1.y = 0.0;
            this.col2.y = 0.0;
        };
       
        B2Mat22.prototype.GetAngle = function () {
            return Math.atan2(this.col1.y, this.col1.x);
        };
       
        B2Mat22.prototype.GetInverse = function (out) {
            var a = this.col1.x;
            var b = this.col2.x;
            var c = this.col1.y;
            var d = this.col2.y;
            var det = a * d - b * c;
            if (det !== 0.0) {
                det = 1.0 / det;
            }
            out.col1.x = det * d;
            out.col2.x = (-det * b);
            out.col1.y = (-det * c);
            out.col2.y = det * a;
            return out;
        };
        
        B2Mat22.prototype.Solve = function (out, bX, bY) {
            if (bX === undefined){bX = 0;}
            if (bY === undefined){bY = 0;}
            var a11 = this.col1.x;
            var a12 = this.col2.x;
            var a21 = this.col1.y;
            var a22 = this.col2.y;
            var det = a11 * a22 - a12 * a21;
            if (det !== 0.0) {
                det = 1.0 / det;
            }
            out.x = det * (a22 * bX - a12 * bY);
            out.y = det * (a11 * bY - a21 * bX);
            return out;
        };

        B2Mat22.prototype.Abs = function () {
            this.col1.Abs();
            this.col2.Abs();
        };
    
        // ***************************************************************************
        //                               b2Transform
        // ***************************************************************************
    
        var B2Transform = function (pos, r) {
            this.position = new B2Vec2();
            this.R = new B2Mat22();
    
            if (pos === undefined){pos = null;}
            if (r === undefined){r = null;}
            if (pos) {
                this.position.SetV(pos);
                this.R.SetM(r);
            }
        };
    
        window.Box2D.Common.Math.b2Transform = B2Transform ;
    
        B2Transform.prototype.Initialize = function (pos, r) {
            this.position.SetV(pos);
            this.R.SetM(r);
        };
       
        B2Transform.prototype.SetIdentity = function () {
            this.position.SetZero();
            this.R.SetIdentity();
        };
       
        B2Transform.prototype.Set = function (x) {
            this.position.SetV(x.position);
            this.R.SetM(x.R);
        };

        B2Transform.prototype.SetAngle = function () {
            return Math.atan2(this.R.col1.y, this.R.col1.x);
        };
    
    
        // ***************************************************************************
        //                               b2Math
        // ***************************************************************************
       
        var b2Math = function () {};

        window.Box2D.Common.Math.b2Math = b2Math ;
    
        b2Math.IsValid = function (x) {
            if (x === undefined){
                x = 0;
            }
            return isFinite(x);
        };

        b2Math.Dot = function (a, b) {
            return a.x * b.x + a.y * b.y;
        };

        b2Math.CrossVV = function (a, b) {
            return a.x * b.y - a.y * b.x;
        };

        b2Math.CrossVF = function (a, s) {
            if (s === undefined){
                s = 0;
            }
            var v = new B2Vec2(s * a.y, (-s * a.x));
            return v;
        };

        b2Math.CrossFV = function (s, a) {
            if (s === undefined){
                s = 0;
            }
            var v = new B2Vec2((-s * a.y), s * a.x);
            return v;
        };

        b2Math.MulMV = function (A, v) {
            if( v === undefined ){
                b2Err("undefined 'v' in b2Math.MulMV");
            }
    
            var u = new B2Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
            return u;
        };

        b2Math.MulTMV = function (A, v) {
            var u = new B2Vec2(b2Math.Dot(v, A.col1), b2Math.Dot(v, A.col2));
            return u;
        };

        b2Math.MulX = function (T, v) {
            var a = b2Math.MulMV(T.R, v);
            a.x += T.position.x;
            a.y += T.position.y;
            return a;
        };

        b2Math.MulXT = function (T, v) {
            var a = b2Math.SubtractVV(v, T.position);
            var tX = (a.x * T.R.col1.x + a.y * T.R.col1.y);
            a.y = (a.x * T.R.col2.x + a.y * T.R.col2.y);
            a.x = tX;
            return a;
        };

        b2Math.AddVV = function (a, b) {
            var v = new B2Vec2(a.x + b.x, a.y + b.y);
            return v;
        };

        b2Math.SubtractVV = function (a, b) {
            var v = new B2Vec2(a.x - b.x, a.y - b.y);
            return v;
        };

        b2Math.Distance = function (a, b) {
            var cX = a.x - b.x;
            var cY = a.y - b.y;
            return Math.sqrt(cX * cX + cY * cY);
        };

        b2Math.DistanceSquared = function (a, b) {
            var cX = a.x - b.x;
            var cY = a.y - b.y;
            return (cX * cX + cY * cY);
        };

        b2Math.MulFV = function (s, a) {
            if (s === undefined){
                s = 0;
            }
            var v = new B2Vec2(s * a.x, s * a.y);
            return v;
        };

        b2Math.AddMM = function (A, B) {
            var C = B2Mat22.FromVV(b2Math.AddVV(A.col1, B.col1), b2Math.AddVV(A.col2, B.col2));
            return C;
        };

        b2Math.MulMM = function (A, B) {
            var C = B2Mat22.FromVV(b2Math.MulMV(A, B.col1), b2Math.MulMV(A, B.col2));
            return C;
        };

        b2Math.MulTMM = function (A, B) {
            var c1 = new B2Vec2(b2Math.Dot(A.col1, B.col1), b2Math.Dot(A.col2, B.col1));
            var c2 = new B2Vec2(b2Math.Dot(A.col1, B.col2), b2Math.Dot(A.col2, B.col2));
            var C = B2Mat22.FromVV(c1, c2);
            return C;
        };

        b2Math.Abs = function (a) {
            if (a === undefined){
                a = 0;
            }
            return a > 0.0 ? a : (-a);
        };
       
        b2Math.AbsV = function (a) {
            var b = new B2Vec2(b2Math.Abs(a.x), b2Math.Abs(a.y));
            return b;
        };
        
        b2Math.AbsM = function (A) {
            var B = B2Mat22.FromVV(b2Math.AbsV(A.col1), b2Math.AbsV(A.col2));
            return B;
        };
       
        b2Math.Min = function (a, b) {
            if (a === undefined){a = 0;}
            if (b === undefined){b = 0;}
            return a < b ? a : b;
        };

        b2Math.MinV = function (a, b) {
            var c = new B2Vec2(b2Math.Min(a.x, b.x), b2Math.Min(a.y, b.y));
            return c;
        };
       
        b2Math.Max = function (a, b) {
            if (a === undefined){a = 0;}
            if (b === undefined){b = 0;}
            return a > b ? a : b;
        };

        b2Math.MaxV = function (a, b) {
            var c = new B2Vec2(b2Math.Max(a.x, b.x), b2Math.Max(a.y, b.y));
            return c;
        };
       
        b2Math.Clamp = function (a, low, high) {
            if (a === undefined){a = 0;}
            if (low === undefined){low = 0;}
            if (high === undefined){high = 0;}
            return a < low ? low : a > high ? high : a;
        };

        b2Math.ClampV = function (a, low, high) {
            return b2Math.MaxV(low, b2Math.MinV(a, high));
        };

        b2Math.Swap = function (a, b) {
            var tmp = a[0];
            a[0] = b[0];
            b[0] = tmp;
        };

        b2Math.Random = function () {
            return Math.random() * 2 - 1;
        };

        b2Math.RandomRange = function (lo, hi) {
            if (lo === undefined){lo = 0;}
            if (hi === undefined){hi = 0;}
            var r = Math.random();
            r = (hi - lo) * r + lo;
            return r;
        };

        /* jshint -W016 */
        b2Math.NextPowerOfTwo = function (x) {
            if (x === undefined){x = 0;}
            x |= (x >> 1) & 0x7FFFFFFF;
            x |= (x >> 2) & 0x3FFFFFFF;
            x |= (x >> 4) & 0x0FFFFFFF;
            x |= (x >> 8) & 0x00FFFFFF;
            x |= (x >> 16) & 0x0000FFFF;
            return x + 1;
        };
       
        b2Math.IsPowerOfTwo = function (x) {
            if (x === undefined){x = 0;}
            var result = x > 0 && (x & (x - 1)) === 0;
            return result;
        };
        /* jshint +W016 */
       
        b2Math.b2Vec2_zero = new B2Vec2(0.0, 0.0);
        b2Math.b2Mat22_identity = B2Mat22.FromVV(new B2Vec2(1.0, 0.0), new B2Vec2(0.0, 1.0));
        b2Math.b2Transform_identity = new B2Transform(b2Math.b2Vec2_zero, b2Math.b2Mat22_identity);
    
        // ***************************************************************************
        //                               b2DebugDraw
        // ***************************************************************************
     
        var B2DebugDraw = function(){
            this.e_aabbBit = 0x0004; 
            this.e_centerOfMassBit = 0x0010;
            this.e_controllerBit = 0x0020;
            this.e_jointBit = 0x0002;
            this.e_pairBit  = 0x0008;
            this.e_shapeBit = 0x000;
        };
    
        window.Box2D.Dynamics.b2DebugDraw = B2DebugDraw ;
    
        B2DebugDraw.prototype.AppendFlags      = function(){};
        B2DebugDraw.prototype.ClearFlags       = function(){};
        B2DebugDraw.prototype.DrawCircle       = function(){};
        B2DebugDraw.prototype.DrawPolygon      = function(){};
        B2DebugDraw.prototype.DrawSegment      = function(){};
        B2DebugDraw.prototype.DrawSolidCircle  = function(){};
        B2DebugDraw.prototype.DrawSolidPolygon = function(){};
        B2DebugDraw.prototype.DrawTransform    = function(){};
        B2DebugDraw.prototype.GetAlpha         = function(){};
        B2DebugDraw.prototype.GetDrawScale     = function(){};
        B2DebugDraw.prototype.GetFillAlpha     = function(){};
        B2DebugDraw.prototype.GetFlags         = function(){};
        B2DebugDraw.prototype.GetLineThickness = function(){};
        B2DebugDraw.prototype.GetSprite        = function(){};
        B2DebugDraw.prototype.GetXFormScale    = function(){};
        B2DebugDraw.prototype.SetAlpha         = function(){};
        B2DebugDraw.prototype.SetDrawScale     = function(){};
        B2DebugDraw.prototype.SetFillAlpha     = function(){};
        B2DebugDraw.prototype.SetFlags         = function(){};
        B2DebugDraw.prototype.SetLineThickness = function(){};
        B2DebugDraw.prototype.SetSprite        = function(){};
        B2DebugDraw.prototype.SetXFormScale    = function(){};
    
    
        // ***************************************************************************
        //                               b2BodyDef
        // ***************************************************************************
       
        var B2BodyDef  = function () {
            this.position = new B2Vec2(0,0);
            this.linearVelocity = new B2Vec2();
            this.userData = null;
            this.angle = 0.0;
            this.linearVelocity.Set(0, 0);
            this.angularVelocity = 0.0;
            this.linearDamping = 0.0;
            this.angularDamping = 0.0;
            this.allowSleep = true;
            this.awake = true;
            this.fixedRotation = false;
            this.bullet = false;
            this.type = B2Body.b2_staticBody;
            this.active = true;
            this.inertiaScale = 1.0;
        };
    
        window.Box2D.Dynamics.b2BodyDef = B2BodyDef;
    
        // ***************************************************************************
        //                                b2Fixture
    // ***************************************************************************
    
        var B2Fixture = function(body,userData, fixtureID, def ) {
            this.m_body = body ;
            this.m_userData = userData ;
            this.m_fixtureID = fixtureID ;
            this.m_shape = {} ;
            this.m_shape.m_centroid = new B2Vec2() ;
            this.m_isSensor = false ;
            this.m_density  = def.density ;
            this.m_friction = def.friction ;
            this.m_restitution = def.restitution ;
            this.m_isSensor = def.isSensor ;
        };
    
        window.Box2D.Dynamics.b2Fixture = B2Fixture ;
    
    
        B2Fixture.prototype.GetBody = function(){ return this.m_body ; } ;
    
        B2Fixture.prototype.GetShape = function() { 
            console.log( "fixture.GetShape not yet supported in CocoonJS Box2D binding" ) ;
            return null ; 
        } ;
    
        B2Fixture.prototype.GetUserData = function() { return this.m_userData ; } ;
    
        B2Fixture.prototype.SetSensor = function(isSensor) { 
            this.m_isSensor = isSensor;
            window.ext.IDTK_SRV_BOX2D.makeCall( "setSensor" , this.m_body.m_world.m_worldID , this.m_fixtureID , this.m_isSensor) ;
        };
    
        B2Fixture.prototype.IsSensor = function() { return this.m_isSensor ; } ;
    
        B2Fixture.prototype.SetDensity     = function( density     ) { window.ext.IDTK_SRV_BOX2D.makeCall( "setDensity"     , this.m_body.m_world.m_worldID , this.m_fixtureID , density     ) ; this.m_density = density         ; } ;
        B2Fixture.prototype.SetFriction    = function( friction    ) { window.ext.IDTK_SRV_BOX2D.makeCall( "setFriction"    , this.m_body.m_world.m_worldID , this.m_fixtureID , friction    ) ; this.m_friction = friction       ; } ;
        B2Fixture.prototype.SetRestitution = function( restitution ) { window.ext.IDTK_SRV_BOX2D.makeCall( "setRestitution" , this.m_body.m_world.m_worldID , this.m_fixtureID , restitution ) ; this.m_restitution = restitution ; } ;
    
        B2Fixture.prototype.GetDensity     = function() { return this.m_density     ; } ;
        B2Fixture.prototype.GetFriction    = function() { return this.m_friction    ; } ;
        B2Fixture.prototype.GetRestitution = function() { return this.m_restitution ; } ;
        
        // ***************************************************************************
        //                                  b2Body
        // ***************************************************************************
    
        var B2Body = function (bd, world) {
            // Backup userdata and set it to null so Cocoon Doesn't read it
            var userData = bd.userData ;
            bd.userData = null;
        
            this.m_world    = world;
            this.m_xf       = new B2Transform( bd.position , B2Mat22.FromAngle(bd.angle));
            this.m_fixtures = [] ;
            this.m_active   = bd.active ;
    
            if( bd.type === B2Body.b2_staticBody ){
                bd.density = 0;
            }
    
            this.m_bodyID = window.ext.IDTK_SRV_BOX2D.makeCall( "createBody" , world.m_worldID , bd ) ;      
            this.m_userData = userData;

            // Restore userdata
            bd.userData = userData ;
        };
    
        window.Box2D.Dynamics.b2Body = B2Body ;
    
        B2Body.prototype.CreateFixture = function (def) {
            var userData = def.userData;
            def.userData = null ;
    
            var fixtureID = window.ext.IDTK_SRV_BOX2D.makeCall( "createFixture" , this.m_world.m_worldID , this.m_bodyID , def ) ; 
            def.userData = userData;
    
            var fixture = new B2Fixture( this , userData , fixtureID , def ) ;
            this.m_world.m_fixturesList[fixtureID] = fixture ;
            this.m_fixtures.push( fixture ) ;
            return fixture;
        };
    
        B2Body.prototype.GetFixtureList = function(){
            if( this.m_fixtures.length === 0 ){
                return null ;
            }
    
            return this.m_fixtures[0] ;
        };
    
        B2Body.prototype.DestroyFixture = function( fixture ){
            window.ext.IDTK_SRV_BOX2D.makeCall( "deleteFixture" , this.m_world.m_worldID , fixture.m_fixtureID ) ; 
            delete this.m_world.m_fixturesList[fixture.m_fixtureID] ;
        };
       
        B2Body.prototype.SetPositionAndAngle = function (position, angle) {
            window.ext.IDTK_SRV_BOX2D.makeCall( "setBodyTransform" , this.m_world.m_worldID , this.m_bodyID , position.x , position.y , angle ) ; 
            this.m_xf.R.Set(angle) ;
            this.m_xf.position.SetV(position) ;
        };
    
        B2Body.prototype.GetPosition = function () { return this.m_xf.position ; } ;
        B2Body.prototype.SetPosition = function (position) { this.SetPositionAndAngle(position, this.GetAngle()) ; } ;
       
        B2Body.prototype.GetLinearVelocity  = function(){
            var v = window.ext.IDTK_SRV_BOX2D.makeCall( "getLinearVelocity" , this.m_world.m_worldID , this.m_bodyID ) ; 
            return new B2Vec2(v[0],v[1]);
        };
    
        B2Body.prototype.GetWorldCenter = function(){
            var p = window.ext.IDTK_SRV_BOX2D.makeCall( "getWorldCenter"  , this.m_world.m_worldID , this.m_bodyID ) ; 
            return new B2Vec2(p[0],p[1]);
        };
    
        B2Body.prototype.GetLocalCenter = function(){
            var p = window.ext.IDTK_SRV_BOX2D.makeCall( "getLocalCenter"  , this.m_world.m_worldID , this.m_bodyID ) ; 
            return new B2Vec2(p[0],p[1]);
        };
    
     
        B2Body.prototype.ApplyImpulse = function( impulse , point , wake ) { 
            window.ext.IDTK_SRV_BOX2D.makeCall( "applyImpulse" , this.m_world.m_worldID , this.m_bodyID , impulse.x , impulse.y , point.x , point.y , wake ) ; 
        };
    
        B2Body.prototype.IsAwake            = function( )               { return window.ext.IDTK_SRV_BOX2D.makeCall( "isAwake"            , this.m_world.m_worldID , this.m_bodyID ) ; } ;
        B2Body.prototype.GetAngularVelocity = function( )               { return window.ext.IDTK_SRV_BOX2D.makeCall( "getAngularVelocity" , this.m_world.m_worldID , this.m_bodyID ) ; } ;
        B2Body.prototype.SetAwake           = function( state )                { window.ext.IDTK_SRV_BOX2D.makeCall( "setAwake"           , this.m_world.m_worldID , this.m_bodyID , state   ) ; } ;
      
        B2Body.prototype.SetLinearVelocity  = function( vel   )                { window.ext.IDTK_SRV_BOX2D.makeCall( "setLinearVelocity"  , this.m_world.m_worldID , this.m_bodyID , vel.x   , vel.y ) ; } ;
        B2Body.prototype.ApplyForceToCenter = function( force , wake )         { window.ext.IDTK_SRV_BOX2D.makeCall( "applyForceToCenter" , this.m_world.m_worldID , this.m_bodyID , force.x , force.y , wake ) ; } ;
        B2Body.prototype.ApplyForce         = function( force , point , wake ) { window.ext.IDTK_SRV_BOX2D.makeCall( "applyForce"         , this.m_world.m_worldID , this.m_bodyID , force.x , force.y , point.x , point.y , wake ) ; } ;
        B2Body.prototype.ApplyTorque        = function( torque, wake )         { window.ext.IDTK_SRV_BOX2D.makeCall( "applyTorque"        , this.m_world.m_worldID , this.m_bodyID , torque , wake ) ; } ;
        B2Body.prototype.SetLinearDamping   = function( damp  )                { window.ext.IDTK_SRV_BOX2D.makeCall( "setLinearDamping"   , this.m_world.m_worldID , this.m_bodyID , damp    ) ; } ;
        B2Body.prototype.SetAngularVelocity = function( angvel)                { window.ext.IDTK_SRV_BOX2D.makeCall( "setAngularVelocity" , this.m_world.m_worldID , this.m_bodyID , angvel  ) ; } ;
        B2Body.prototype.SetType            = function( type  )                { window.ext.IDTK_SRV_BOX2D.makeCall( "setType"            , this.m_world.m_worldID , this.m_bodyID , type    ) } ;
        B2Body.prototype.SetActive          = function( state )                { window.ext.IDTK_SRV_BOX2D.makeCall( "setActive"          , this.m_world.m_worldID , this.m_bodyID , state   ) ; this.m_active = state ; } ;
        B2Body.prototype.IsActive           = function( ) { return this.m_active ; } ;
    
        B2Body.prototype.GetAngle = function () { return this.m_xf.R.GetAngle() ; } ;
    
        B2Body.prototype.SetAngle = function (angle) {
            if (angle === undefined){
                angle = 0;
            }
            this.SetPositionAndAngle(this.GetPosition(), angle);
        };
    
        B2Body.prototype.GetContactList = function () {
            var contacts = window.ext.IDTK_SRV_BOX2D.makeCall( "getObjectContacts" , this.m_world.m_worldID , this.m_bodyID ) ; 
            var result = [];
            for(var i = 0 ; i < contacts.length ; i++){
                result.push(this.m_world.m_bodyList[contacts[i]]);
            }
          
            return result;
        };
    
        B2Body.prototype.SetUserData = function (data) { this.m_userData = data ; } ;
        B2Body.prototype.GetUserData = function () { return this.m_userData ; } ;
        B2Body.prototype.GetWorld    = function () { return this.m_world ; } ;
      
        window.Box2D.Dynamics.b2Body.b2_staticBody    = 0;
        window.Box2D.Dynamics.b2Body.b2_kinematicBody = 1;
        window.Box2D.Dynamics.b2Body.b2_dynamicBody   = 2;
    
    
        // ***************************************************************************
        //                                 Contact
        // ***************************************************************************
       
        var B2Contact = function (fixtureA , fixtureB , touching ) {
            this.m_fixtureA = fixtureA ;
            this.m_fixtureB = fixtureB ;
            this.m_touching = touching ;
        };
        
        window.Box2D.Dynamics.b2Contact = B2Contact ;
          
        B2Contact.prototype.GetFixtureA = function(){ return this.m_fixtureA ; } ;
        B2Contact.prototype.GetFixtureB = function(){ return this.m_fixtureB ; } ;
        B2Contact.prototype.IsTouching  = function(){ return this.m_touching ; } ;
       
        //GetNext():b2Contact
    
        // ***************************************************************************
        //                                Contact listener
        // ***************************************************************************
      
        var B2ContactListener = function () {};
        window.Box2D.Dynamics.b2ContactListener = B2ContactListener ;
    
        B2ContactListener.prototype.BeginContact = function (/*contact*/) {} ;// NOTE: Only this one is called at the moment
        B2ContactListener.prototype.EndContact   = function (/*contact*/) {} ;
        B2ContactListener.prototype.PreSolve     = function (/*contact, oldManifold*/) {} ;
        B2ContactListener.prototype.PostSolve    = function (/*contact, impulse*/) {} ;
       
        window.Box2D.Dynamics.b2ContactListener.b2_defaultListener = new B2ContactListener();
       
        // ***************************************************************************
        //                            b2ContactFilter
        // ***************************************************************************

        var B2ContactFilter = function() {} ;

        window.Box2D.Dynamics.b2ContactFilter = B2ContactFilter ;

        // ***************************************************************************
        //                                b2World
        // ***************************************************************************

        var B2World = function (gravity, doSleep) {
            this.m_bodyList = [];
            this.m_jointList = [];
            this.m_fixturesList = [];
            this.m_contactListener = null ;
            this.m_jointsList = [] ;
    
            this.m_worldID = window.ext.IDTK_SRV_BOX2D.makeCall( "createWorld" , gravity.x , gravity.y , doSleep );
        };

        window.Box2D.Dynamics.b2World = B2World;
    
        B2World.prototype.SetContactListener = function (listener) { this.m_contactListener = listener ; } ;

        B2World.prototype.SetContactFilter = function(filter){
            var _filter = filter ;
            var world = this ;
            var callbackFunc = function(a , b){
                var fa = world.m_fixturesList[a];
                var fb = world.m_fixturesList[b];
                return _filter.ShouldCollide(fa,fb);
            }
            window.ext.IDTK_SRV_BOX2D.makeCall("setContactFilter", callbackFunc) ;
        };
         
        B2World.prototype.CreateBody = function (def) {
            var b = new B2Body(def, this);
            this.m_bodyList[b.m_bodyID] = b;
            return b;
        };
    
        B2World.prototype.DestroyBody = function (b) {
            window.ext.IDTK_SRV_BOX2D.makeCall( "deleteBody" , this.m_worldID , b.m_bodyID ) ; 
            delete this.m_bodyList[b.m_bodyID];
            for( var i =0 ; i < b.m_fixtures.length ; ++i ){
                delete this.m_fixturesList[b.m_fixtures[i].m_fixtureID] ;
            }
        };
    
        B2World.prototype.CreateJoint = function (def) {
            if( def.bodyA.m_bodyID === def.bodyB.m_bodyID ){
                return ;
            }
          
            var bodyA = def.bodyA ;
            var bodyB = def.bodyB ;
            def.bodyA = bodyA.m_bodyID ;
            def.bodyB = bodyB.m_bodyID ;
    
            window.ext.IDTK_SRV_BOX2D.makeCall( "createDistanceJoint" , this.m_worldID , def ) ;
    
            def.bodyA = bodyA ;
            def.bodyB = bodyB ;
            var joint = new B2Joint(def) ;
            this.m_jointsList.push( joint ) ;
    
            return joint ;
        };
    
        B2World.prototype.GetJointList = function () {
            if( this.m_jointsList.length === 0 ){
                return null ;
            }
    
            // Build the linked-list impersonation inside of the array
            for( var i = 0 ; i < this.m_jointsList.length - 1 ; ++i ){
                this.m_jointsList[i].next = this.m_jointsList[i+1] ;
            }
    
            this.m_jointsList[this.m_jointsList.length-1].next = null ;
    
            return this.m_jointsList[0];
        };
       
        B2World.prototype.SetContinuousPhysics = function (continuous) { window.ext.IDTK_SRV_BOX2D.makeCall( "setContinuous" , this.m_worldID, continuous ) ; } ;
        B2World.prototype.SetGravity           = function (gravity) { window.ext.IDTK_SRV_BOX2D.makeCall( "setGravity" , this.m_worldID, gravity.x , gravity.y ) ; } ;
       
        B2World.prototype.Step = function (dt, velocityIterations, positionIterations) {
            var i;
            var transforms = window.ext.IDTK_SRV_BOX2D.makeCall( "step" , this.m_worldID, dt , velocityIterations , positionIterations );
       
            var count = transforms[0]; // Array returns [ <number of elements> , elem1.bodyID , elem1.posX , elem1.posY , elem1.angle, elem2.bodyID , ....]
    
            for( i = 1; i <= count * 4 ; i+=4 ){
                var body = this.m_bodyList[ transforms[i+0] ];
    
                if( body === null ){ // end of the transforms array
                    break ;
                }
             
                body.m_xf.position.Set(transforms[i+1] ,transforms[i+2] ) ;
                body.m_xf.R.Set(transforms[i+3]);
            }
    
            // Handle object contacts
            if( this.m_contactListener !== null ){
                var contacts = window.ext.IDTK_SRV_BOX2D.makeCall( "getLastContacts" , this.m_worldID );
                count = contacts[0];
                for( i = 1 ; i<= count*3 ; i+=3 ){
                    var f1 = contacts[i+0];
                    var f2 = contacts[i+1];
                    var touching = contacts[i+2];
    
                    var fix1 = this.m_fixturesList[f1];
                    var fix2 = this.m_fixturesList[f2];
                    if( (typeof(fix1) === 'undefined' ) || (typeof(fix2) === 'undefined' ) ){
                        console.log("One of the fixtures in a contact DOESN'T EXIST!!");
                        continue ;
                    }
    
                    this.m_contactListener.BeginContact( new B2Contact(fix1,fix2,touching) ) ;
                }
            }
        };
    
        B2World.prototype.ClearForces = function () {
            window.ext.IDTK_SRV_BOX2D.makeCall( "clearForces" , this.m_worldID );
        };
    
        B2World.prototype.SetDebugDraw = function(/*d*/){} ;
        B2World.prototype.DrawDebugData = function(){};
    
        // ***************************************************************************
        //                                Shapes
        // ***************************************************************************
    
        window.Box2D.Collision.Shapes.b2CircleShape = function (radius){
            this.radius = radius ;
            this.type = "circle";
        };
    
        window.Box2D.Collision.Shapes.b2PolygonShape = function (){
            this.SetAsBox = function (width,height){
                this.type = "box";
                this.width  = width  ;
                this.height = height ;
            };
            
            this.SetAsEdge = function (v1, v2){
                this.type = "edge";
                this.p1x = v1.x;
                this.p1y = v1.y;
                this.p2x = v2.x;
                this.p2y = v2.y;
            };

            this.SetAsArray = function ( vec , length ){
                this.type = "polygon";
                this.vertices = [] ;
             
                for( var i = 0; i < length ; i++ ){
                    this.vertices.push( vec[i].x );
                    this.vertices.push( vec[i].y );
                }
            };
        };
    
        // ***************************************************************************
        //                                b2FixtureDef
        // ***************************************************************************
    
        var b2FixtureDef = function () {
            this.shape = null;
            this.userData = null;
            this.friction = 0.2;
            this.restitution = 0.0;
            this.density = 0.0;
            this.isSensor = false;
            this.filter = {
                categoryBits : 1 ,
                maskBits : 0xFFFF ,
                groupIndex : 0
            } ;
        };
    
        window.Box2D.Dynamics.b2FixtureDef = b2FixtureDef ;
       
        // ***************************************************************************
        //                             b2Joint
        // ***************************************************************************
    
        var B2Joint = function( def ) {
            this.bodyA = def.bodyA;
            this.bodyB = def.bodyB;
            this.userData = def.userData ;
            this.type = def.type ;
            this.next = null ;
        };
      
        window.Box2D.Dynamics.Joints.b2Joint = B2Joint ;
    
        B2Joint.prototype.GetBodyA    = function() { return this.bodyA    ; } ;
        B2Joint.prototype.GetBodyB    = function() { return this.bodyB    ; } ;
        B2Joint.prototype.GetUserData = function() { return this.userData ; } ;
        B2Joint.prototype.GetType     = function() { return this.type     ; } ;
        B2Joint.prototype.GetNext     = function() { return this.next     ; } ;
      
        B2Joint.e_distanceJoint = 0 ;
          
        // ***************************************************************************
        //                             b2DistanceJointDef
        // ***************************************************************************
    
        var B2DistanceJointDef = function( bA , bB , anchorA , anchorB ) {
            this.type = B2Joint.e_distanceJoint ;
            this.localAnchorA = new B2Vec2() ;
            this.localAnchorB = new B2Vec2() ;
            this.userData = null ;
    
            if( bA !== undefined ){this.bodyA = bA ;}
            if( bB !== undefined ){this.bodyB = bB ;}
            if( anchorA !== undefined ){this.localAnchorA.SetV(anchorA) ;}
            if( anchorB !== undefined ){this.localAnchorB.SetV(anchorB) ;}
    
            if( anchorA !== undefined && anchorB !== undefined ){
                var dX = anchorB.x - anchorA.x ;
                var dY = anchorB.y - anchorA.y ;
                this.length = Math.sqrt(dX * dX + dY * dY) ;
            }
            this.frequencyHz  = 0.0 ;
            this.dampingRatio = 0.0 ;
        };
    
        window.Box2D.Dynamics.Joints.b2DistanceJointDef = B2DistanceJointDef ;

    })();
}
