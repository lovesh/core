/*
   Copyright (C) 2019 MIRACL UK Ltd.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.


    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

     https://www.gnu.org/licenses/agpl-3.0.en.html

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   You can be released from the requirements of the license by purchasing     
   a commercial license. Buying such a license is mandatory as soon as you
   develop commercial activities involving the MIRACL Core Crypto SDK
   without disclosing the source code of your own applications, or shipping
   the MIRACL Core Crypto SDK with a closed source product.     
*/

/* CORE Weierstrass elliptic curve functions over ctx.FP8 */

var ECP8 = function(ctx) {
    "use strict";

    /* Constructor, set this=O */
    var ECP8 = function() {
        this.x = new ctx.FP8(0);
        this.y = new ctx.FP8(1);
        this.z = new ctx.FP8(0);
    };

    ECP8.prototype = {
        /* Test this=O? */
        is_infinity: function() {
            return (this.x.iszilch() && this.z.iszilch());
        },

        /* copy this=P */
        copy: function(P) {
            this.x.copy(P.x);
            this.y.copy(P.y);
            this.z.copy(P.z);
        },

        /* set this=O */
        inf: function() {
            this.x.zero();
            this.y.one();
            this.z.zero();
        },

        /* conditional move of Q to P dependant on d */
        cmove: function(Q, d) {
            this.x.cmove(Q.x, d);
            this.y.cmove(Q.y, d);
            this.z.cmove(Q.z, d);
        },

        /* Constant time select from pre-computed table */
        select: function(W, b) {
            var MP = new ECP8(),
                m = b >> 31,
                babs = (b ^ m) - m;

            babs = (babs - 1) / 2;

            this.cmove(W[0], ECP8.teq(babs, 0)); // conditional move
            this.cmove(W[1], ECP8.teq(babs, 1));
            this.cmove(W[2], ECP8.teq(babs, 2));
            this.cmove(W[3], ECP8.teq(babs, 3));
            this.cmove(W[4], ECP8.teq(babs, 4));
            this.cmove(W[5], ECP8.teq(babs, 5));
            this.cmove(W[6], ECP8.teq(babs, 6));
            this.cmove(W[7], ECP8.teq(babs, 7));

            MP.copy(this);
            MP.neg();
            this.cmove(MP, (m & 1));
        },

        /* Test P == Q */
        equals: function(Q) {
            var a, b;

            a = new ctx.FP8(this.x);
            b = new ctx.FP8(Q.x);

            a.mul(Q.z);
            b.mul(this.z);
            if (!a.equals(b)) {
                return false;
            }

            a.copy(this.y);
            a.mul(Q.z);
            b.copy(Q.y);
            b.mul(this.z);
            if (!a.equals(b)) {
                return false;
            }

            return true;
        },

        /* set this=-this */
        neg: function() {
            this.y.norm();
            this.y.neg();
            this.y.norm();
            return;
        },

        /* convert this to affine, from (x,y,z) to (x,y) */
        affine: function() {
            var one;

            if (this.is_infinity()) {
                return;
            }

            one = new ctx.FP8(1);

            if (this.z.equals(one)) {
                this.x.reduce();
                this.y.reduce();
                return;
            }

            this.z.inverse();
            this.x.mul(this.z);
            this.x.reduce();
            this.y.mul(this.z);
            this.y.reduce();
            this.z.copy(one);
        },

        /* extract affine x as ctx.FP8 */
        getX: function() {
			var W=new ECP8(); W.copy(this); W.affine();
            return W.x;
        },

        /* extract affine y as ctx.FP8 */
        getY: function() {
			var W=new ECP8(); W.copy(this); W.affine();
            return W.y;
        },

        /* extract projective x */
        getx: function() {
            return this.x;
        },

        /* extract projective y */
        gety: function() {
            return this.y;
        },

        /* extract projective z */
        getz: function() {
            return this.z;
        },

        /* convert this to byte array */
        toBytes: function(b, compress) {
            var t = [],
                i;
			var W=new ECP8(); W.copy(this);
            W.affine();
            b[0]=0x06;

            W.x.geta().geta().getA().toBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                b[i+1] = t[i];
            }
            W.x.geta().geta().getB().toBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                b[i + ctx.BIG.MODBYTES+1] = t[i];
            }
            W.x.geta().getb().getA().toBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                b[i + 2*ctx.BIG.MODBYTES+1] = t[i];
            }
            W.x.geta().getb().getB().toBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                b[i + 3*ctx.BIG.MODBYTES+1] = t[i];
            }

            W.x.getb().geta().getA().toBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                b[i + 4*ctx.BIG.MODBYTES+1] = t[i];
            }
            W.x.getb().geta().getB().toBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                b[i + 5*ctx.BIG.MODBYTES+1] = t[i];
            }
            W.x.getb().getb().getA().toBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                b[i + 6*ctx.BIG.MODBYTES+1] = t[i];
            }
            W.x.getb().getb().getB().toBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                b[i + 7*ctx.BIG.MODBYTES+1] = t[i];
            }
            if (!compress)
            {
                b[0] = 0x04;
                W.y.geta().geta().getA().toBytes(t);
                for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                    b[i + 8 * ctx.BIG.MODBYTES+1] = t[i];
                }
                W.y.geta().geta().getB().toBytes(t);
                for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                    b[i + 9 * ctx.BIG.MODBYTES+1] = t[i];
                }
                W.y.geta().getb().getA().toBytes(t);
                for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                    b[i + 10 * ctx.BIG.MODBYTES+1] = t[i];
                }
                W.y.geta().getb().getB().toBytes(t);
                for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                    b[i + 11 * ctx.BIG.MODBYTES+1] = t[i];
                }

                W.y.getb().geta().getA().toBytes(t);
                for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                    b[i + 12 * ctx.BIG.MODBYTES+1] = t[i];
                }
                W.y.getb().geta().getB().toBytes(t);
                for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                    b[i + 13 * ctx.BIG.MODBYTES+1] = t[i];
                }
                W.y.getb().getb().getA().toBytes(t);
                for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                    b[i + 14 * ctx.BIG.MODBYTES+1] = t[i];
                }
                W.y.getb().getb().getB().toBytes(t);
                for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                    b[i + 15 * ctx.BIG.MODBYTES+1] = t[i];
                }
            } else {
                b[0]=0x02;
                if (W.y.sign() == 1)
                    b[0]=0x03;
            }
        },

        /* convert this to hex string */
        toString: function() {
			var W=new ECP8(); W.copy(this);
            if (W.is_infinity()) {
                return "infinity";
            }
            W.affine();
            return "(" + W.x.toString() + "," + W.y.toString() + ")";
        },

        /* set this=(x,y) */
        setxy: function(ix, iy) {
            var rhs, y2;

            this.x.copy(ix);
            this.y.copy(iy);
            this.z.one();
			this.x.norm();

            rhs = ECP8.RHS(this.x);

            y2 = new ctx.FP8(this.y); //y2.copy(this.y);
            y2.sqr();

            if (!y2.equals(rhs)) {
                this.inf();
            }
        },

        /* set this=(x,.) */
        setx: function(ix,s) {
            var rhs;

            this.x.copy(ix);
            this.z.one();
			this.x.norm();
            rhs = ECP8.RHS(this.x);

            //alert("0. rhs= "+rhs.toString());
		    if (rhs.qr()==1) 
		    {
                rhs.sqrt();
                //alert("1. rhs= "+rhs.toString());
                if (rhs.sign() != s)
                    rhs.neg();
                rhs.reduce();
			    this.y.copy(rhs);
            } else {
                this.inf();
            }
        },

        /* set this*=q, where q is Modulus, using Frobenius */
        frob: function(F,n) {
            for (var i=0;i<n;i++) {
                this.x.frob(F[2]);
				if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.M_TYPE) {
					this.x.qmul(F[0]);
					this.x.times_i2();
				}
				if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.D_TYPE) {
					this.x.qmul(F[0]);
					this.x.times_i2();
				}

				this.y.frob(F[2]);
				if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.M_TYPE) {
					this.y.qmul(F[1]);
					this.y.times_i2();
					this.y.times_i();
				}
				if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.D_TYPE) {
					this.y.qmul(F[1]);
					this.y.times_i();
				}

                this.z.frob(F[2]);
            }
        },

        /* this+=this */
        dbl: function() {
            var iy, t0, t1, t2, x3, y3;

            iy = new ctx.FP8(this.y);
            if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.D_TYPE) {
                iy.times_i();
                iy.norm();
            }

            t0 = new ctx.FP8(this.y);
            t0.sqr();
            if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.D_TYPE) {
                t0.times_i();
            }
            t1 = new ctx.FP8(iy);
            t1.mul(this.z);
            t2 = new ctx.FP8(this.z);
            t2.sqr();

            this.z.copy(t0);
            this.z.add(t0);
            this.z.norm();
            this.z.add(this.z);
            this.z.add(this.z);
            this.z.norm();

            t2.imul(3 * ctx.ROM_CURVE.CURVE_B_I);
            if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.M_TYPE) {
                t2.times_i();
            }

            x3 = new ctx.FP8(t2);
            x3.mul(this.z);

            y3 = new ctx.FP8(t0);

            y3.add(t2);
            y3.norm();
            this.z.mul(t1);
            t1.copy(t2);
            t1.add(t2);
            t2.add(t1);
            t2.norm();
            t0.sub(t2);
            t0.norm(); //y^2-9bz^2
            y3.mul(t0);
            y3.add(x3); //(y^2+3z*2)(y^2-9z^2)+3b.z^2.8y^2
            t1.copy(this.x);
            t1.mul(iy); //
            this.x.copy(t0);
            this.x.norm();
            this.x.mul(t1);
            this.x.add(this.x); //(y^2-9bz^2)xy2

            this.x.norm();
            this.y.copy(y3);
            this.y.norm();

            return 1;
        },

        /* this+=Q */
        add: function(Q) {
            var b, t0, t1, t2, t3, t4, x3, y3, z3;

            b = 3 * ctx.ROM_CURVE.CURVE_B_I;
            t0 = new ctx.FP8(this.x);
            t0.mul(Q.x); // x.Q.x
            t1 = new ctx.FP8(this.y);
            t1.mul(Q.y); // y.Q.y

            t2 = new ctx.FP8(this.z);
            t2.mul(Q.z);
            t3 = new ctx.FP8(this.x);
            t3.add(this.y);
            t3.norm(); //t3=X1+Y1
            t4 = new ctx.FP8(Q.x);
            t4.add(Q.y);
            t4.norm(); //t4=X2+Y2
            t3.mul(t4); //t3=(X1+Y1)(X2+Y2)
            t4.copy(t0);
            t4.add(t1); //t4=X1.X2+Y1.Y2

            t3.sub(t4);
            t3.norm();
            if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.D_TYPE) {
                t3.times_i();  //t3=(X1+Y1)(X2+Y2)-(X1.X2+Y1.Y2) = X1.Y2+X2.Y1
            }

            t4.copy(this.y);
            t4.add(this.z);
            t4.norm(); //t4=Y1+Z1
            x3 = new ctx.FP8(Q.y);
            x3.add(Q.z);
            x3.norm(); //x3=Y2+Z2

            t4.mul(x3); //t4=(Y1+Z1)(Y2+Z2)
            x3.copy(t1); //
            x3.add(t2); //X3=Y1.Y2+Z1.Z2

            t4.sub(x3);
            t4.norm();
            if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.D_TYPE) {
                t4.times_i();  //t4=(Y1+Z1)(Y2+Z2) - (Y1.Y2+Z1.Z2) = Y1.Z2+Y2.Z1
            }

            x3.copy(this.x);
            x3.add(this.z);
            x3.norm(); // x3=X1+Z1
            y3 = new ctx.FP8(Q.x);
            y3.add(Q.z);
            y3.norm(); // y3=X2+Z2
            x3.mul(y3); // x3=(X1+Z1)(X2+Z2)
            y3.copy(t0);
            y3.add(t2); // y3=X1.X2+Z1+Z2
            y3.rsub(x3);
            y3.norm(); // y3=(X1+Z1)(X2+Z2) - (X1.X2+Z1.Z2) = X1.Z2+X2.Z1

            if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.D_TYPE) {
                t0.times_i();
                t1.times_i();
            }

            x3.copy(t0);
            x3.add(t0);
            t0.add(x3);
            t0.norm();
            t2.imul(b);
            if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.M_TYPE) {
                t2.times_i();
            }

            z3 = new ctx.FP8(t1);
            z3.add(t2);
            z3.norm();
            t1.sub(t2);
            t1.norm();
            y3.imul(b);
            if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.M_TYPE) {
                y3.times_i();
            }

            x3.copy(y3);
            x3.mul(t4);
            t2.copy(t3);
            t2.mul(t1);
            x3.rsub(t2);
            y3.mul(t0);
            t1.mul(z3);
            y3.add(t1);
            t0.mul(t3);
            z3.mul(t4);
            z3.add(t0);

            this.x.copy(x3);
            this.x.norm();
            this.y.copy(y3);
            this.y.norm();
            this.z.copy(z3);
            this.z.norm();

            return 0;
        },

        /* this-=Q */
        sub: function(Q) {
            var D;
			var NQ=new ECP8(); NQ.copy(Q);
            NQ.neg();
            D = this.add(NQ);
            return D;
        },

        /* P*=e */
        mul: function(e) {
            /* fixed size windows */
            var mt = new ctx.BIG(),
                t = new ctx.BIG(),
                C = new ECP8(),
                P = new ECP8(),
                Q = new ECP8(),
                W = [],
                w = [],
                i, nb, s, ns;

            if (this.is_infinity()) {
                return new ECP8();
            }

            // precompute table
            Q.copy(this);
            Q.dbl();
            W[0] = new ECP8();
            W[0].copy(this);

            for (i = 1; i < 8; i++) {
                W[i] = new ECP8();
                W[i].copy(W[i - 1]);
                W[i].add(Q);
            }

            // make exponent odd - add 2P if even, P if odd
            t.copy(e);
            s = t.parity();
            t.inc(1);
            t.norm();
            ns = t.parity();
            mt.copy(t);
            mt.inc(1);
            mt.norm();
            t.cmove(mt, s);
            Q.cmove(this, ns);
            C.copy(Q);

            nb = 1 + Math.floor((t.nbits() + 3) / 4);

            // convert exponent to signed 4-bit window
            for (i = 0; i < nb; i++) {
                w[i] = (t.lastbits(5) - 16);
                t.dec(w[i]);
                t.norm();
                t.fshr(4);
            }
            w[nb] = t.lastbits(5);

            P.copy(W[Math.floor((w[nb] - 1) / 2)]);
            for (i = nb - 1; i >= 0; i--) {
                Q.select(W, w[i]);
                P.dbl();
                P.dbl();
                P.dbl();
                P.dbl();
                P.add(Q);
            }
            P.sub(C);
            P.affine();

            return P;
        },
    /* clear cofactor */
        cfp: function(h) {
            var F=ECP8.frob_constants(),
            x, X, X2, X4,
            xQ, x2Q, x3Q, x4Q, x5Q, x6Q, x7Q, x8Q;

        /* Fast Hashing to G2 - Fuentes-Castaneda, Knapp and Rodriguez-Henriquez */
            x = new ctx.BIG(0);
            x.rcopy(ctx.ROM_CURVE.CURVE_Bnx);


            xQ = this.mul(x);
            x2Q = xQ.mul(x);
            x3Q = x2Q.mul(x);
            x4Q = x3Q.mul(x);
            x5Q = x4Q.mul(x);
            x6Q = x5Q.mul(x);
            x7Q = x6Q.mul(x);
            x8Q = x7Q.mul(x);

            if (ctx.ECP.SIGN_OF_X == ctx.ECP.NEGATIVEX) {
                xQ.neg();
                x3Q.neg();
                x5Q.neg();
                x7Q.neg();
            }

            x8Q.sub(x7Q);
            x8Q.sub(this);

            x7Q.sub(x6Q);
            x7Q.frob(F,1);

            x6Q.sub(x5Q);
            x6Q.frob(F,2);

            x5Q.sub(x4Q);
            x5Q.frob(F,3);

            x4Q.sub(x3Q);
            x4Q.frob(F,4);

            x3Q.sub(x2Q);
            x3Q.frob(F,5);

            x2Q.sub(xQ);
            x2Q.frob(F,6);

            xQ.sub(this);
            xQ.frob(F,7);

            this.dbl();
            this.frob(F,8);

            this.add(x8Q);
            this.add(x7Q);
            this.add(x6Q);
            this.add(x5Q);

            this.add(x4Q);
            this.add(x3Q);
            this.add(x2Q);
            this.add(xQ);

            this.affine()
        }
    };

    // set to group generator
    ECP8.generator = function() {
        var G=new ECP8(),
            A = new ctx.BIG(0),
            B = new ctx.BIG(0),
            XAA, XAB, XA, XBA, XBB, XB, X,
            YAA, YAB, YA, YBA, YBB, YB, Y;

        A.rcopy(ctx.ROM_CURVE.CURVE_Pxaaa);
        B.rcopy(ctx.ROM_CURVE.CURVE_Pxaab);
        XAA= new ctx.FP2(A,B);

        A.rcopy(ctx.ROM_CURVE.CURVE_Pxaba);
        B.rcopy(ctx.ROM_CURVE.CURVE_Pxabb);

        XAB= new ctx.FP2(A,B);
        XA=new ctx.FP4(XAA,XAB);

        A.rcopy(ctx.ROM_CURVE.CURVE_Pxbaa);
        B.rcopy(ctx.ROM_CURVE.CURVE_Pxbab);
        XBA= new ctx.FP2(A,B);

        A.rcopy(ctx.ROM_CURVE.CURVE_Pxbba);
        B.rcopy(ctx.ROM_CURVE.CURVE_Pxbbb);

        XBB= new ctx.FP2(A,B);
        XB=new ctx.FP4(XBA,XBB);

        X=new ctx.FP8(XA,XB);


        A.rcopy(ctx.ROM_CURVE.CURVE_Pyaaa);
        B.rcopy(ctx.ROM_CURVE.CURVE_Pyaab);
        YAA= new ctx.FP2(A,B);

        A.rcopy(ctx.ROM_CURVE.CURVE_Pyaba);
        B.rcopy(ctx.ROM_CURVE.CURVE_Pyabb);

        YAB= new ctx.FP2(A,B);
        YA=new ctx.FP4(YAA,YAB);

        A.rcopy(ctx.ROM_CURVE.CURVE_Pybaa);
        B.rcopy(ctx.ROM_CURVE.CURVE_Pybab);
        YBA= new ctx.FP2(A,B);

        A.rcopy(ctx.ROM_CURVE.CURVE_Pybba);
        B.rcopy(ctx.ROM_CURVE.CURVE_Pybbb);

        YBB= new ctx.FP2(A,B);
        YB=new ctx.FP4(YBA,YBB);

        Y=new ctx.FP8(YA,YB);

        G.setxy(X,Y);

        return G;
    };

    /* convert from byte array to point */
    ECP8.fromBytes = function(b) {
        var t = [],
            ra, rb, ra4, rb4, ra8, rb8, i, rx, ry, P;
        var typ= b[0];
        P = new ECP8();

        for (i = 0; i < ctx.BIG.MODBYTES; i++) {
            t[i] = b[i+1];
        }
        ra = ctx.BIG.fromBytes(t);
        for (i = 0; i < ctx.BIG.MODBYTES; i++) {
            t[i] = b[i + ctx.BIG.MODBYTES+1];
        }
        rb = ctx.BIG.fromBytes(t);
        ra4=new ctx.FP2(ra,rb);

        for (i = 0; i < ctx.BIG.MODBYTES; i++) {
            t[i] = b[i  + 2*ctx.BIG.MODBYTES+1];
        }
        ra = ctx.BIG.fromBytes(t);
        for (i = 0; i < ctx.BIG.MODBYTES; i++) {
            t[i] = b[i + 3*ctx.BIG.MODBYTES+1];
        }
        rb = ctx.BIG.fromBytes(t);
        rb4=new ctx.FP2(ra,rb);

        ra8=new ctx.FP4(ra4,rb4);

        for (i = 0; i < ctx.BIG.MODBYTES; i++) {
            t[i] = b[i + 4*ctx.BIG.MODBYTES+1];
        }
        ra = ctx.BIG.fromBytes(t);
        for (i = 0; i < ctx.BIG.MODBYTES; i++) {
            t[i] = b[i + 5*ctx.BIG.MODBYTES+1];
        }
        rb = ctx.BIG.fromBytes(t);
        ra4=new ctx.FP2(ra,rb);

        for (i = 0; i < ctx.BIG.MODBYTES; i++) {
            t[i] = b[i  + 6*ctx.BIG.MODBYTES+1];
        }
        ra = ctx.BIG.fromBytes(t);
        for (i = 0; i < ctx.BIG.MODBYTES; i++) {
            t[i] = b[i + 7*ctx.BIG.MODBYTES+1];
        }
        rb = ctx.BIG.fromBytes(t);
        rb4=new ctx.FP2(ra,rb);

        rb8=new ctx.FP4(ra4,rb4);

        rx = new ctx.FP8(ra8, rb8); //rx.bset(ra,rb);

        if (typ == 0x04)
        {
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                t[i] = b[i + 8 * ctx.BIG.MODBYTES+1];
            }
            ra = ctx.BIG.fromBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                t[i] = b[i + 9 * ctx.BIG.MODBYTES+1];
            }
            rb = ctx.BIG.fromBytes(t);
            ra4=new ctx.FP2(ra,rb);

            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                t[i] = b[i + 10 * ctx.BIG.MODBYTES+1];
            }
            ra = ctx.BIG.fromBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                t[i] = b[i + 11 * ctx.BIG.MODBYTES+1];
            }
            rb = ctx.BIG.fromBytes(t);
            rb4=new ctx.FP2(ra,rb);

            ra8=new ctx.FP4(ra4,rb4);

            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                t[i] = b[i + 12 * ctx.BIG.MODBYTES+1];
            }
            ra = ctx.BIG.fromBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                t[i] = b[i + 13 * ctx.BIG.MODBYTES+1];
            }
            rb = ctx.BIG.fromBytes(t);
            ra4=new ctx.FP2(ra,rb);

            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                t[i] = b[i + 14 * ctx.BIG.MODBYTES+1];
            }
            ra = ctx.BIG.fromBytes(t);
            for (i = 0; i < ctx.BIG.MODBYTES; i++) {
                t[i] = b[i + 15 * ctx.BIG.MODBYTES+1];
            }
            rb = ctx.BIG.fromBytes(t);
            rb4=new ctx.FP2(ra,rb);

            rb8=new ctx.FP4(ra4,rb4);

            ry = new ctx.FP8(ra8, rb8); //ry.bset(ra,rb);

            P.setxy(rx, ry);
        } else {
            P.setx(rx,typ&1);
        }   
        return P;
    };

    /* Calculate RHS of curve equation x^3+B */
    ECP8.RHS = function(x) {
        var r, c, b;

        //x.norm();
        r = new ctx.FP8(x); //r.copy(x);
        r.sqr();

        c = new ctx.BIG(0);
        c.rcopy(ctx.ROM_CURVE.CURVE_B);
        b = new ctx.FP8(c); //b.bseta(c);

        if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.D_TYPE) {
            b.div_i();
        }
        if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.M_TYPE) {
            b.times_i();
        }

        r.mul(x);
        r.add(b);

        r.reduce();
        return r;
    };

    /* P=u0.Q0+u1*Q1+u2*Q2+u3*Q3... */
    // Bos & Costello https://eprint.iacr.org/2013/458.pdf
    // Faz-Hernandez & Longa & Sanchez  https://eprint.iacr.org/2013/158.pdf
    // Side channel attack secure
    ECP8.mul16 = function(Q, u) {
        var W = new ECP8(),
            P = new ECP8(),
            T1 = [],
            T2 = [],
            T3 = [],
            T4 = [],
            mt = new ctx.BIG(),
            t = [],
            w1 = [],
            s1 = [],
            w2 = [],
            s2 = [],
            w3 = [],
            s3 = [],
            w4 = [],
            s4 = [],
            i, j, k, nb, bt, pb1, pb2, pb3, pb4;

        for (i = 0; i < 16; i++) {
            t[i] = new ctx.BIG(u[i]); t[i].norm();
            //Q[i].affine();
        }

        T1[0] = new ECP8(); T1[0].copy(Q[0]); // Q[0]
        T1[1] = new ECP8(); T1[1].copy(T1[0]); T1[1].add(Q[1]); // Q[0]+Q[1]
        T1[2] = new ECP8(); T1[2].copy(T1[0]); T1[2].add(Q[2]); // Q[0]+Q[2]
        T1[3] = new ECP8(); T1[3].copy(T1[1]); T1[3].add(Q[2]); // Q[0]+Q[1]+Q[2]
        T1[4] = new ECP8(); T1[4].copy(T1[0]); T1[4].add(Q[3]); // Q[0]+Q[3]
        T1[5] = new ECP8(); T1[5].copy(T1[1]); T1[5].add(Q[3]); // Q[0]+Q[1]+Q[3]
        T1[6] = new ECP8(); T1[6].copy(T1[2]); T1[6].add(Q[3]); // Q[0]+Q[2]+Q[3]
        T1[7] = new ECP8(); T1[7].copy(T1[3]); T1[7].add(Q[3]); // Q[0]+Q[1]+Q[2]+Q[3]

        T2[0] = new ECP8(); T2[0].copy(Q[4]); // Q[0]
        T2[1] = new ECP8(); T2[1].copy(T2[0]); T2[1].add(Q[5]); // Q[0]+Q[1]
        T2[2] = new ECP8(); T2[2].copy(T2[0]); T2[2].add(Q[6]); // Q[0]+Q[2]
        T2[3] = new ECP8(); T2[3].copy(T2[1]); T2[3].add(Q[6]); // Q[0]+Q[1]+Q[2]
        T2[4] = new ECP8(); T2[4].copy(T2[0]); T2[4].add(Q[7]); // Q[0]+Q[3]
        T2[5] = new ECP8(); T2[5].copy(T2[1]); T2[5].add(Q[7]); // Q[0]+Q[1]+Q[3]
        T2[6] = new ECP8(); T2[6].copy(T2[2]); T2[6].add(Q[7]); // Q[0]+Q[2]+Q[3]
        T2[7] = new ECP8(); T2[7].copy(T2[3]); T2[7].add(Q[7]); // Q[0]+Q[1]+Q[2]+Q[3]

        T3[0] = new ECP8(); T3[0].copy(Q[8]); // Q[0]
        T3[1] = new ECP8(); T3[1].copy(T3[0]); T3[1].add(Q[9]); // Q[0]+Q[1]
        T3[2] = new ECP8(); T3[2].copy(T3[0]); T3[2].add(Q[10]); // Q[0]+Q[2]
        T3[3] = new ECP8(); T3[3].copy(T3[1]); T3[3].add(Q[10]); // Q[0]+Q[1]+Q[2]
        T3[4] = new ECP8(); T3[4].copy(T3[0]); T3[4].add(Q[11]); // Q[0]+Q[3]
        T3[5] = new ECP8(); T3[5].copy(T3[1]); T3[5].add(Q[11]); // Q[0]+Q[1]+Q[3]
        T3[6] = new ECP8(); T3[6].copy(T3[2]); T3[6].add(Q[11]); // Q[0]+Q[2]+Q[3]
        T3[7] = new ECP8(); T3[7].copy(T3[3]); T3[7].add(Q[11]); // Q[0]+Q[1]+Q[2]+Q[3]

        T4[0] = new ECP8(); T4[0].copy(Q[12]); // Q[0]
        T4[1] = new ECP8(); T4[1].copy(T4[0]); T4[1].add(Q[13]); // Q[0]+Q[1]
        T4[2] = new ECP8(); T4[2].copy(T4[0]); T4[2].add(Q[14]); // Q[0]+Q[2]
        T4[3] = new ECP8(); T4[3].copy(T4[1]); T4[3].add(Q[14]); // Q[0]+Q[1]+Q[2]
        T4[4] = new ECP8(); T4[4].copy(T4[0]); T4[4].add(Q[15]); // Q[0]+Q[3]
        T4[5] = new ECP8(); T4[5].copy(T4[1]); T4[5].add(Q[15]); // Q[0]+Q[1]+Q[3]
        T4[6] = new ECP8(); T4[6].copy(T4[2]); T4[6].add(Q[15]); // Q[0]+Q[2]+Q[3]
        T4[7] = new ECP8(); T4[7].copy(T4[3]); T4[7].add(Q[15]); // Q[0]+Q[1]+Q[2]+Q[3]

        // Make it odd
        pb1=1-t[0].parity();
        t[0].inc(pb1);
        t[0].norm();

        pb2=1-t[4].parity();
        t[4].inc(pb2);
        t[4].norm();

        pb3=1-t[8].parity();
        t[8].inc(pb3);
        t[8].norm();

        pb4=1-t[12].parity();
        t[12].inc(pb4);
        t[12].norm();

        // Number of bits
        mt.zero();
        for (i=0;i<16;i++) {
            mt.or(t[i]);
        }

        nb=1+mt.nbits();

        // Sign pivot
        s1[nb-1]=1;
        s2[nb-1]=1;
        s3[nb-1]=1;
        s4[nb-1]=1;
        for (i=0;i<nb-1;i++) {
            t[0].fshr(1);
            s1[i]=2*t[0].parity()-1;
            t[4].fshr(1);
            s2[i]=2*t[4].parity()-1;

            t[8].fshr(1);
            s3[i]=2*t[8].parity()-1;
            t[12].fshr(1);
            s4[i]=2*t[12].parity()-1;
        }

        // Recoded exponent
        for (i=0; i<nb; i++) {
            w1[i]=0;
            k=1;
            for (j=1; j<4; j++) {
                bt=s1[i]*t[j].parity();
                t[j].fshr(1);
                t[j].dec(bt>>1);
                t[j].norm();
                w1[i]+=bt*k;
                k*=2;
            }
            w2[i]=0;
            k=1;
            for (j=5; j<8; j++) {
                bt=s2[i]*t[j].parity();
                t[j].fshr(1);
                t[j].dec(bt>>1);
                t[j].norm();
                w2[i]+=bt*k;
                k*=2;
            }

            w3[i]=0;
            k=1;
            for (j=9; j<12; j++) {
                bt=s3[i]*t[j].parity();
                t[j].fshr(1);
                t[j].dec(bt>>1);
                t[j].norm();
                w3[i]+=bt*k;
                k*=2;
            }
            w4[i]=0;
            k=1;
            for (j=13; j<16; j++) {
                bt=s4[i]*t[j].parity();
                t[j].fshr(1);
                t[j].dec(bt>>1);
                t[j].norm();
                w4[i]+=bt*k;
                k*=2;
            }
        }

        // Main loop
        P.select(T1,2*w1[nb-1]+1);
        W.select(T2,2*w2[nb-1]+1);
        P.add(W);
        W.select(T3,2*w3[nb-1]+1);
        P.add(W);
        W.select(T4,2*w4[nb-1]+1);
        P.add(W);
        for (i=nb-2;i>=0;i--) {
            P.dbl();
            W.select(T1,2*w1[i]+s1[i]);
            P.add(W);
            W.select(T2,2*w2[i]+s2[i]);
            P.add(W);
            W.select(T3,2*w3[i]+s3[i]);
            P.add(W);
            W.select(T4,2*w4[i]+s4[i]);
            P.add(W);
        }

        // apply correction
        W.copy(P);
        W.sub(Q[0]);
        P.cmove(W,pb1);

        W.copy(P);
        W.sub(Q[4]);
        P.cmove(W,pb2);

        W.copy(P);
        W.sub(Q[8]);
        P.cmove(W,pb3);

        W.copy(P);
        W.sub(Q[12]);
        P.cmove(W,pb4);

        P.affine();
        return P;
    };

    /* return 1 if b==c, no branching */
    ECP8.teq = function(b, c) {
        var x = b ^ c;
        x -= 1; // if x=0, x now -1
        return ((x >> 31) & 1);
    };

/* Deterministic mapping of Fp to point on curve */
    ECP8.hashit = function(h)
    { // SWU method
        var sgn,ne;
        var W=new ctx.FP8(1);

        var c = new ctx.BIG(0);
        c.rcopy(ctx.ROM_CURVE.CURVE_B);
        var B = new ctx.FP8(c);

        var t=new ctx.FP(h);
        var s=new ctx.FP(-3);
        var one=new ctx.FP(1);

		if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.D_TYPE) B.div_i();
		if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.M_TYPE) B.times_i();
        B.norm();
        sgn=t.sign();
        var w=s.sqrt(null);
        var j=new ctx.FP(w); j.sub(one); j.norm(); j.div2();

        w.mul(t);
        var b=new ctx.FP(t);
        b.sqr();
        b.add(one);
        var Y=new ctx.FP8(b);
        B.add(Y); B.norm(); B.inverse();
        B.tmul(w);

        var X1=new ctx.FP8(B); X1.tmul(t);
        Y.copy(new ctx.FP8(j));
        var X2=new ctx.FP8(X1); X2.sub(Y); X2.norm();
        X1.copy(X2); X1.neg(); X1.norm();
        X2.sub(W); X2.norm();

        B.sqr(); B.inverse();
        var X3=new ctx.FP8(B); X3.add(W); X3.norm();

        Y.copy(ECP8.RHS(X2));
        X1.cmove(X2,Y.qr());
        Y.copy(ECP8.RHS(X3));
        X1.cmove(X3,Y.qr());
        Y.copy(ECP8.RHS(X1));
        Y.sqrt();

        ne=Y.sign()^sgn;
        W.copy(Y); W.neg(); W.norm();
        Y.cmove(W,ne);

        var P=new ECP8();
        P.setxy(X1,Y);
        return P;
    };

/* Map octet string to curve point */
	ECP8.mapit = function(h)
	{
		var q=new ctx.BIG(0);
        q.rcopy(ctx.ROM_FIELD.Modulus);
		var dx=ctx.DBIG.fromBytes(h);
        var x=dx.mod(q);
		
		var Q=ECP8.hashit(x);
		Q.cfp();
        return Q;
    };

    ECP8.frob_constants = function() {
        var fa = new ctx.BIG(0),
            fb = new ctx.BIG(0),
            F=[],
            X, F0, F1, F2;

        fa.rcopy(ctx.ROM_FIELD.Fra);
        fb.rcopy(ctx.ROM_FIELD.Frb);
        X = new ctx.FP2(fa, fb);

        F0=new ctx.FP2(X); F0.sqr();
        F2=new ctx.FP2(F0);
        F2.mul_ip(); F2.norm();
        F1=new ctx.FP2(F2); F1.sqr();
        F2.mul(F1);

        F2.mul_ip(); F2.norm();

        F1.copy(X);
        if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.M_TYPE) {
            F1.mul_ip(); 	F1.norm();
            F1.inverse();
            F0.copy(F1); F0.sqr();
	
			F1.mul(F0);
		}
		if (ctx.ECP.SEXTIC_TWIST == ctx.ECP.D_TYPE)
		{
			F0.copy(F1); F0.sqr();
			F1.mul(F0);
			F0.mul_ip();  	F0.norm();
			F1.mul_ip(); 	F1.norm();
			F1.mul_ip(); 	F1.norm();
		}
/*
        }
        F0.mul_ip(); F0.norm();
        F1.mul(F0); */

        F[0]=new ctx.FP2(F0); F[1]=new ctx.FP2(F1); F[2]=new ctx.FP2(F2);
        return F;
    };

    return ECP8;
};
