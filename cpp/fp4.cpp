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

/* CORE Fp^4 functions */
/* SU=m, m is Stack Usage (no lazy )*/

/* FP4 elements are of the form a+ib, where i is sqrt(-1+sqrt(-1)) */

#include "fp4_YYY.h"

using namespace XXX;

/* test x==0 ? */
/* SU= 8 */
int YYY::FP4_iszilch(FP4 *x)
{
    if (FP2_iszilch(&(x->a)) && FP2_iszilch(&(x->b))) return 1;
    return 0;
}

/* test x==1 ? */
/* SU= 8 */
int YYY::FP4_isunity(FP4 *x)
{
    if (FP2_isunity(&(x->a)) && FP2_iszilch(&(x->b))) return 1;
    return 0;
}

/* test is w real? That is in a+ib test b is zero */
int YYY::FP4_isreal(FP4 *w)
{
    return FP2_iszilch(&(w->b));
}

/* return 1 if x==y, else 0 */
/* SU= 16 */
int YYY::FP4_equals(FP4 *x, FP4 *y)
{
    if (FP2_equals(&(x->a), &(y->a)) && FP2_equals(&(x->b), &(y->b)))
        return 1;
    return 0;
}

/* set FP4 from two FP2s */
/* SU= 16 */
void YYY::FP4_from_FP2s(FP4 *w, FP2 * x, FP2* y)
{
    FP2_copy(&(w->a), x);
    FP2_copy(&(w->b), y);
}

/* set FP4 from FP2 */
/* SU= 8 */
void YYY::FP4_from_FP2(FP4 *w, FP2 *x)
{
    FP2_copy(&(w->a), x);
    FP2_zero(&(w->b));
}

/* set high part of FP4 from FP2 */
/* SU= 8 */
void YYY::FP4_from_FP2H(FP4 *w, FP2 *x)
{
    FP2_copy(&(w->b), x);
    FP2_zero(&(w->a));
}

/* set FP4 from FP */
void YYY::FP4_from_FP(FP4 *w, FP *x)
{
    FP2 t;
    FP2_from_FP(&t, x);
    FP4_from_FP2(w, &t);
}

/* FP4 copy w=x */
/* SU= 16 */
void YYY::FP4_copy(FP4 *w, FP4 *x)
{
    if (w == x) return;
    FP2_copy(&(w->a), &(x->a));
    FP2_copy(&(w->b), &(x->b));
}

/* FP4 w=0 */
/* SU= 8 */
void YYY::FP4_zero(FP4 *w)
{
    FP2_zero(&(w->a));
    FP2_zero(&(w->b));
}

/* FP4 w=1 */
/* SU= 8 */
void YYY::FP4_one(FP4 *w)
{
    FP2_one(&(w->a));
    FP2_zero(&(w->b));
}

int YYY::FP4_sign(FP4 *w)
{
    BIG m;
    FP_redc(m,&(w->a.a));
    return BIG_parity(m);
}

/* Set w=-x */
/* SU= 160 */
void YYY::FP4_neg(FP4 *w, FP4 *x)
{
    /* Just one field neg */
    FP2 m, t;
    FP4_norm(x);

    FP2_add(&m, &(x->a), &(x->b));
    FP2_neg(&m, &m);
    FP2_add(&t, &m, &(x->b));
    FP2_add(&(w->b), &m, &(x->a));
    FP2_copy(&(w->a), &t);
    FP4_norm(w);
}

/* Set w=conj(x) */
/* SU= 16 */
void YYY::FP4_conj(FP4 *w, FP4 *x)
{
    FP2_copy(&(w->a), &(x->a));
    FP2_neg(&(w->b), &(x->b));
    FP4_norm(w);
}

/* Set w=-conj(x) */
/* SU= 16 */
void YYY::FP4_nconj(FP4 *w, FP4 *x)
{
    FP2_copy(&(w->b), &(x->b));
    FP2_neg(&(w->a), &(x->a));
    FP4_norm(w);
}

/* Set w=x+y */
/* SU= 16 */
void YYY::FP4_add(FP4 *w, FP4 *x, FP4 *y)
{
    FP2_add(&(w->a), &(x->a), &(y->a));
    FP2_add(&(w->b), &(x->b), &(y->b));
}

/* Set w=x-y */
/* Input y MUST be normed */
void YYY::FP4_sub(FP4 *w, FP4 *x, FP4 *y)
{
    FP4 my;
    FP4_neg(&my, y);
    FP4_add(w, x, &my);
}
/* SU= 8 */
/* reduce all components of w mod Modulus */
void YYY::FP4_reduce(FP4 *w)
{
    FP2_reduce(&(w->a));
    FP2_reduce(&(w->b));
}

/* SU= 8 */
/* normalise all elements of w */
void YYY::FP4_norm(FP4 *w)
{
    FP2_norm(&(w->a));
    FP2_norm(&(w->b));
}

/* Set w=s*x, where s is FP2 */
/* SU= 16 */
void YYY::FP4_pmul(FP4 *w, FP4 *x, FP2 *s)
{
    FP2_mul(&(w->a), &(x->a), s);
    FP2_mul(&(w->b), &(x->b), s);
}

/* Set w=s*x, where s is FP */
void YYY::FP4_qmul(FP4 *w, FP4 *x, FP *s)
{
    FP2_pmul(&(w->a), &(x->a), s);
    FP2_pmul(&(w->b), &(x->b), s);
}

/* SU= 16 */
/* Set w=s*x, where s is int */
void YYY::FP4_imul(FP4 *w, FP4 *x, int s)
{
    FP2_imul(&(w->a), &(x->a), s);
    FP2_imul(&(w->b), &(x->b), s);
}

/* Set w=x^2 */
/* Input MUST be normed  */
void YYY::FP4_sqr(FP4 *w, FP4 *x)
{
    FP2 t1, t2, t3;

    FP2_mul(&t3, &(x->a), &(x->b)); /* norms x */
    FP2_copy(&t2, &(x->b));
    FP2_add(&t1, &(x->a), &(x->b));
    FP2_mul_ip(&t2);

    FP2_add(&t2, &(x->a), &t2);

    FP2_norm(&t1);  // 2
    FP2_norm(&t2);  // 2

    FP2_mul(&(w->a), &t1, &t2);

    FP2_copy(&t2, &t3);
    FP2_mul_ip(&t2);

    FP2_add(&t2, &t2, &t3);

    FP2_norm(&t2);  // 2
    FP2_neg(&t2, &t2);
    FP2_add(&(w->a), &(w->a), &t2); /* a=(a+b)(a+i^2.b)-i^2.ab-ab = a*a+ib*ib */
    FP2_add(&(w->b), &t3, &t3); /* b=2ab */

    FP4_norm(w);
}

/* Set w=x*y */
/* Inputs MUST be normed  */
void YYY::FP4_mul(FP4 *w, FP4 *x, FP4 *y)
{

    FP2 t1, t2, t3, t4;

    FP2_mul(&t1, &(x->a), &(y->a));

    FP2_mul(&t2, &(x->b), &(y->b));
    FP2_add(&t3, &(y->b), &(y->a));
    FP2_add(&t4, &(x->b), &(x->a));

    FP2_norm(&t4); // 2
    FP2_norm(&t3); // 2

    FP2_mul(&t4, &t4, &t3); /* (xa+xb)(ya+yb) */

    FP2_neg(&t3, &t1); // 1
    FP2_add(&t4, &t4, &t3); //t4E=3
    FP2_norm(&t4);

    FP2_neg(&t3, &t2); // 1
    FP2_add(&(w->b), &t4, &t3); //wbE=3

    FP2_mul_ip(&t2);
    FP2_add(&(w->a), &t2, &t1);

    FP4_norm(w);
}

/* output FP4 in format [a,b] */
/* SU= 8 */
void YYY::FP4_output(FP4 *w)
{
    printf("[");
    FP2_output(&(w->a));
    printf(",");
    FP2_output(&(w->b));
    printf("]");
}

/* SU= 8 */
void YYY::FP4_rawoutput(FP4 *w)
{
    printf("[");
    FP2_rawoutput(&(w->a));
    printf(",");
    FP2_rawoutput(&(w->b));
    printf("]");
}

/* Set w=1/x */
/* SU= 160 */
void YYY::FP4_inv(FP4 *w, FP4 *x)
{
    FP2 t1, t2;
    FP2_sqr(&t1, &(x->a));
    FP2_sqr(&t2, &(x->b));
    FP2_mul_ip(&t2);
    FP2_norm(&t2);
    FP2_sub(&t1, &t1, &t2);
    FP2_inv(&t1, &t1);
    FP2_mul(&(w->a), &t1, &(x->a));
    FP2_neg(&t1, &t1);
    FP2_norm(&t1);
    FP2_mul(&(w->b), &t1, &(x->b));
}

/* w*=i where i = sqrt(2^i+sqrt(-1)) */
/* SU= 200 */
void YYY::FP4_times_i(FP4 *w)
{
    FP2 t;
    FP2_copy(&t, &(w->b));
    FP2_copy(&(w->b), &(w->a));
    FP2_mul_ip(&t);
    FP2_copy(&(w->a), &t);
    FP4_norm(w);
#if TOWER_YYY == POSITOWER
    FP4_neg(w, w);  // ***
    FP4_norm(w);
#endif
}

/* Set w=w^p using Frobenius */
/* SU= 16 */
void YYY::FP4_frob(FP4 *w, FP2 *f)
{
    FP2_conj(&(w->a), &(w->a));
    FP2_conj(&(w->b), &(w->b));
    FP2_mul( &(w->b), f, &(w->b));
}

/* Set r=a^b mod m */
/* SU= 240 */
/*
void YYY::FP4_pow(FP4 *r, FP4* a, BIG b)
{
    FP4 w;
    BIG z, zilch;
    int bt;

    BIG_zero(zilch);
    BIG_copy(z, b);
    BIG_norm(z);
    FP4_copy(&w, a);
    FP4_norm(&w);
    FP4_one(r);

    while (1)
    {
        bt = BIG_parity(z);
        BIG_shr(z, 1);
        if (bt) FP4_mul(r, r, &w);
        if (BIG_comp(z, zilch) == 0) break;
        FP4_sqr(&w, &w);
    }
    FP4_reduce(r);
}
*/
#if CURVE_SECURITY_ZZZ == 128

/* SU= 304 */
/* XTR xtr_a function */
void YYY::FP4_xtr_A(FP4 *r, FP4 *w, FP4 *x, FP4 *y, FP4 *z)
{
    FP4 t1, t2;

    FP4_copy(r, x);
    FP4_sub(&t1, w, y);
    FP4_norm(&t1);
    FP4_pmul(&t1, &t1, &(r->a));
    FP4_add(&t2, w, y);
    FP4_norm(&t2);
    FP4_pmul(&t2, &t2, &(r->b));
    FP4_times_i(&t2);

    FP4_add(r, &t1, &t2);
    FP4_add(r, r, z);

    FP4_reduce(r);
}

/* SU= 152 */
/* XTR xtr_d function */
void YYY::FP4_xtr_D(FP4 *r, FP4 *x)
{
    FP4 w;
    FP4_copy(r, x);
    FP4_conj(&w, r);
    FP4_add(&w, &w, &w);
    FP4_sqr(r, r);
    FP4_norm(&w);
    FP4_sub(r, r, &w);
    FP4_reduce(r);    /* reduce here as multiple calls trigger automatic reductions */
}

/* SU= 728 */
/* r=x^n using XTR method on traces of FP12s */
void YYY::FP4_xtr_pow(FP4 *r, FP4 *x, BIG n)
{
    int i, par, nb;
    BIG v;
    FP2 w;
    FP4 t, a, b, c, sf;

    BIG_zero(v);
    BIG_inc(v, 3);
    BIG_norm(v);
    FP2_from_BIG(&w, v);
    FP4_from_FP2(&a, &w);
    FP4_copy(&sf, x);
    FP4_norm(&sf);
    FP4_copy(&b, &sf);
    FP4_xtr_D(&c, &sf);

    par = BIG_parity(n);
    BIG_copy(v, n);
    BIG_norm(v);
    BIG_shr(v, 1);
    if (par == 0)
    {
        BIG_dec(v, 1);
        BIG_norm(v);
    }

    nb = BIG_nbits(v);
    for (i = nb - 1; i >= 0; i--)
    {
        if (!BIG_bit(v, i))
        {
            FP4_copy(&t, &b);
            FP4_conj(&sf, &sf);
            FP4_conj(&c, &c);
            FP4_xtr_A(&b, &a, &b, &sf, &c);
            FP4_conj(&sf, &sf);
            FP4_xtr_D(&c, &t);
            FP4_xtr_D(&a, &a);
        }
        else
        {
            FP4_conj(&t, &a);
            FP4_xtr_D(&a, &b);
            FP4_xtr_A(&b, &c, &b, &sf, &t);
            FP4_xtr_D(&c, &c);
        }
    }

    if (par == 0) FP4_copy(r, &c);
    else FP4_copy(r, &b);
    FP4_reduce(r);
}

/* SU= 872 */
/* r=ck^a.cl^n using XTR double exponentiation method on traces of FP12s. See Stam thesis. */
void YYY::FP4_xtr_pow2(FP4 *r, FP4 *ck, FP4 *cl, FP4 *ckml, FP4 *ckm2l, BIG a, BIG b)
{
    int i, f2;
    BIG d, e, w;
    FP4 t, cu, cv, cumv, cum2v;


    BIG_copy(e, a);
    BIG_copy(d, b);
    BIG_norm(e);
    BIG_norm(d);
    FP4_copy(&cu, ck);
    FP4_copy(&cv, cl);
    FP4_copy(&cumv, ckml);
    FP4_copy(&cum2v, ckm2l);

    f2 = 0;
    while (BIG_parity(d) == 0 && BIG_parity(e) == 0)
    {
        BIG_shr(d, 1);
        BIG_shr(e, 1);
        f2++;
    }
    while (BIG_comp(d, e) != 0)
    {
        if (BIG_comp(d, e) > 0)
        {
            BIG_imul(w, e, 4);
            BIG_norm(w);
            if (BIG_comp(d, w) <= 0)
            {
                BIG_copy(w, d);
                BIG_copy(d, e);
                BIG_sub(e, w, e);
                BIG_norm(e);
                FP4_xtr_A(&t, &cu, &cv, &cumv, &cum2v);
                FP4_conj(&cum2v, &cumv);
                FP4_copy(&cumv, &cv);
                FP4_copy(&cv, &cu);
                FP4_copy(&cu, &t);
            }
            else if (BIG_parity(d) == 0)
            {
                BIG_shr(d, 1);
                FP4_conj(r, &cum2v);
                FP4_xtr_A(&t, &cu, &cumv, &cv, r);
                FP4_xtr_D(&cum2v, &cumv);
                FP4_copy(&cumv, &t);
                FP4_xtr_D(&cu, &cu);
            }
            else if (BIG_parity(e) == 1)
            {
                BIG_sub(d, d, e);
                BIG_norm(d);
                BIG_shr(d, 1);
                FP4_xtr_A(&t, &cu, &cv, &cumv, &cum2v);
                FP4_xtr_D(&cu, &cu);
                FP4_xtr_D(&cum2v, &cv);
                FP4_conj(&cum2v, &cum2v);
                FP4_copy(&cv, &t);
            }
            else
            {
                BIG_copy(w, d);
                BIG_copy(d, e);
                BIG_shr(d, 1);
                BIG_copy(e, w);
                FP4_xtr_D(&t, &cumv);
                FP4_conj(&cumv, &cum2v);
                FP4_conj(&cum2v, &t);
                FP4_xtr_D(&t, &cv);
                FP4_copy(&cv, &cu);
                FP4_copy(&cu, &t);
            }
        }
        if (BIG_comp(d, e) < 0)
        {
            BIG_imul(w, d, 4);
            BIG_norm(w);
            if (BIG_comp(e, w) <= 0)
            {
                BIG_sub(e, e, d);
                BIG_norm(e);
                FP4_xtr_A(&t, &cu, &cv, &cumv, &cum2v);
                FP4_copy(&cum2v, &cumv);
                FP4_copy(&cumv, &cu);
                FP4_copy(&cu, &t);
            }
            else if (BIG_parity(e) == 0)
            {
                BIG_copy(w, d);
                BIG_copy(d, e);
                BIG_shr(d, 1);
                BIG_copy(e, w);
                FP4_xtr_D(&t, &cumv);
                FP4_conj(&cumv, &cum2v);
                FP4_conj(&cum2v, &t);
                FP4_xtr_D(&t, &cv);
                FP4_copy(&cv, &cu);
                FP4_copy(&cu, &t);
            }
            else if (BIG_parity(d) == 1)
            {
                BIG_copy(w, e);
                BIG_copy(e, d);
                BIG_sub(w, w, d);
                BIG_norm(w);
                BIG_copy(d, w);
                BIG_shr(d, 1);
                FP4_xtr_A(&t, &cu, &cv, &cumv, &cum2v);
                FP4_conj(&cumv, &cumv);
                FP4_xtr_D(&cum2v, &cu);
                FP4_conj(&cum2v, &cum2v);
                FP4_xtr_D(&cu, &cv);
                FP4_copy(&cv, &t);
            }
            else
            {
                BIG_shr(d, 1);
                FP4_conj(r, &cum2v);
                FP4_xtr_A(&t, &cu, &cumv, &cv, r);
                FP4_xtr_D(&cum2v, &cumv);
                FP4_copy(&cumv, &t);
                FP4_xtr_D(&cu, &cu);
            }
        }
    }
    FP4_xtr_A(r, &cu, &cv, &cumv, &cum2v);
    for (i = 0; i < f2; i++)    FP4_xtr_D(r, r);
    FP4_xtr_pow(r, r, d);
}

#endif

/* New stuff for ECp4 support */

/* Set w=x/2 */
void YYY::FP4_div2(FP4 *w, FP4 *x)
{
    FP2_div2(&(w->a), &(x->a));
    FP2_div2(&(w->b), &(x->b));
}

/* Move b to a if d=1 */
void YYY::FP4_cmove(FP4 *f, FP4 *g, int d)
{
    FP2_cmove(&(f->a), &(g->a), d);
    FP2_cmove(&(f->b), &(g->b), d);
}

#if CURVE_SECURITY_ZZZ >= 192

/* test for x a QR */
int YYY::FP4_qr(FP4 *x)
{ /* test x^(p^4-1)/2 = 1 */
    
    FP4 c;
    FP4_conj(&c,x);
    FP4_mul(&c,&c,x);

    return FP2_qr(&(c.a));
}

/* sqrt(a+xb) = sqrt((a+sqrt(a*a-n*b*b))/2)+x.b/(2*sqrt((a+sqrt(a*a-n*b*b))/2)) */

void YYY::FP4_sqrt(FP4 *r, FP4* x)
{
    FP2 a, b, s, t;

    FP4_copy(r, x);
    if (FP4_iszilch(x)) return;

    FP2_copy(&a, &(x->a));
    FP2_copy(&s, &(x->b));

    FP2_sqr(&s, &s); // s*=s
    FP2_sqr(&a, &a); // a*=a
    FP2_mul_ip(&s);
    FP2_norm(&s);
    FP2_sub(&a, &a, &s); // a-=txx(s)
    FP2_norm(&a); // **

    FP2_sqrt(&s, &a);

    FP2_copy(&t, &(x->a));

    FP2_add(&a, &t, &s);
    FP2_norm(&a);
    FP2_div2(&a, &a);

    FP2_sub(&b, &t, &s);
    FP2_norm(&b);
    FP2_div2(&b, &b);

    FP2_cmove(&a,&b,FP2_qr(&b)); // one or the other will be a QR

    FP2_sqrt(&a, &a);
    FP2_copy(&t, &(x->b));
    FP2_add(&s, &a, &a); FP2_norm(&s);
    FP2_inv(&s, &s);

    FP2_mul(&t, &t, &s);
    FP4_from_FP2s(r, &a, &t);
}

void YYY::FP4_div_i(FP4 *f)
{
    FP2 u, v;
    FP2_copy(&u, &(f->a));
    FP2_copy(&v, &(f->b));

    FP2_div_ip(&u);

    FP2_copy(&(f->a), &v);
    FP2_copy(&(f->b), &u);

#if TOWER_YYY == POSITOWER
    FP4_neg(f, f);  // ***
    FP4_norm(f);
#endif
}


#endif
