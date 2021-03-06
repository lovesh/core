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

/**
 * @file fp.h
 * @author Mike Scott
 * @brief FP Header File
 *
 */

#ifndef FP_YYY_H
#define FP_YYY_H

#include "big_XXX.h"
#include "config_field_YYY.h"


/**
	@brief FP Structure - quadratic extension field
*/

typedef struct
{
    BIG_XXX g;	/**< Big representation of field element */
    sign32 XES;	/**< Excess */
} FP_YYY;


/* Field Params - see rom.c */
extern const BIG_XXX Modulus_YYY;	/**< Actual Modulus set in rom_field_yyy.c */
extern const BIG_XXX ROI_YYY;	    /**< Root of unity set in rom_field_yyy.c */
extern const BIG_XXX R2modp_YYY;	/**< Montgomery constant */
extern const chunk MConst_YYY;		/**< Constant associated with Modulus - for Montgomery = 1/p mod 2^BASEBITS */


#define MODBITS_YYY MBITS_YYY                        /**< Number of bits in Modulus for selected curve */
#define TBITS_YYY (MBITS_YYY%BASEBITS_XXX)           /**< Number of active bits in top word */
#define TMASK_YYY (((chunk)1<<TBITS_YYY)-1)          /**< Mask for active bits in top word */
#define FEXCESS_YYY (((sign32)1<<MAXXES_YYY)-1)	     /**< 2^(BASEBITS*NLEN-MODBITS)-1 - normalised BIG can be multiplied by less than this before reduction */
#define OMASK_YYY (-((chunk)(1)<<TBITS_YYY))         /**<  for masking out overflow bits */

//#define FUSED_MODMUL
//#define DEBUG_REDUCE

/* FP prototypes */

/**	@brief Create FP from integer
 *
	@param x FP to be initialised
	@param a integer
 */
extern void FP_YYY_from_int(FP_YYY *x,int a);

/**	@brief Tests for FP equal to zero mod Modulus
 *
	@param x FP number to be tested
	@return 1 if zero, else returns 0
 */
extern int FP_YYY_iszilch(FP_YYY *x);


/**	@brief Tests for FP equal to one mod Modulus
 *
	@param x FP number to be tested
	@return 1 if one, else returns 0
 */
extern int FP_YYY_isunity(FP_YYY *x);


/**	@brief Set FP to zero
 *
	@param x FP number to be set to 0
 */
extern void FP_YYY_zero(FP_YYY *x);

/**	@brief Copy an FP
 *
	@param y FP number to be copied to
	@param x FP to be copied from
 */
extern void FP_YYY_copy(FP_YYY *y, FP_YYY *x);

/**	@brief Copy from ROM to an FP
 *
	@param y FP number to be copied to
	@param x BIG to be copied from ROM
 */
extern void FP_YYY_rcopy(FP_YYY *y, const BIG_XXX x);


/**	@brief Compares two FPs
 *
	@param x FP number
	@param y FP number
	@return 1 if equal, else returns 0
 */
extern int FP_YYY_equals(FP_YYY *x, FP_YYY *y);


/**	@brief Conditional constant time swap of two FP numbers
 *
	Conditionally swaps parameters in constant time (without branching)
	@param x an FP number
	@param y another FP number
	@param s swap takes place if not equal to 0
 */
extern void FP_YYY_cswap(FP_YYY *x, FP_YYY *y, int s);
/**	@brief Conditional copy of FP number
 *
	Conditionally copies second parameter to the first (without branching)
	@param x an FP number
	@param y another FP number
	@param s copy takes place if not equal to 0
 */
extern void FP_YYY_cmove(FP_YYY *x, FP_YYY *y, int s);
/**	@brief Converts from BIG integer to residue form mod Modulus
 *
	@param x BIG number to be converted
	@param y FP result
 */
extern void FP_YYY_nres(FP_YYY *y, BIG_XXX x);
/**	@brief Converts from residue form back to BIG integer form
 *
	@param y FP number to be converted to BIG
	@param x BIG result
 */
extern void FP_YYY_redc(BIG_XXX x, FP_YYY *y);
/**	@brief Sets FP to representation of unity in residue form
 *
	@param x FP number to be set equal to unity.
 */
extern void FP_YYY_one(FP_YYY *x);

/**	@brief returns "sign" of an FP
 *
	@param x FP number
    @return 0 for positive, 1 for negative
 */
extern int FP_YYY_sign(FP_YYY *x);


/**	@brief Reduces DBIG to BIG exploiting special form of the modulus
 *
	This function comes in different flavours depending on the form of Modulus that is currently in use.
	@param r BIG number, on exit = d mod Modulus
	@param d DBIG number to be reduced
 */
extern void FP_YYY_mod(BIG_XXX r, DBIG_XXX d);

#ifdef FUSED_MODMUL
extern void FP_YYY_modmul(BIG_XXX, BIG_XXX, BIG_XXX);
#endif

/**	@brief Fast Modular multiplication of two FPs, mod Modulus
 *
	Uses appropriate fast modular reduction method
	@param x FP number, on exit the modular product = y*z mod Modulus
	@param y FP number, the multiplicand
	@param z FP number, the multiplier
 */
extern void FP_YYY_mul(FP_YYY *x, FP_YYY *y, FP_YYY *z);
/**	@brief Fast Modular multiplication of an FP, by a small integer, mod Modulus
 *
	@param x FP number, on exit the modular product = y*i mod Modulus
	@param y FP number, the multiplicand
	@param i a small number, the multiplier
 */
extern void FP_YYY_imul(FP_YYY *x, FP_YYY *y, int i);
/**	@brief Fast Modular squaring of an FP, mod Modulus
 *
	Uses appropriate fast modular reduction method
	@param x FP number, on exit the modular product = y^2 mod Modulus
	@param y FP number, the number to be squared

 */
extern void FP_YYY_sqr(FP_YYY *x, FP_YYY *y);
/**	@brief Modular addition of two FPs, mod Modulus
 *
	@param x FP number, on exit the modular sum = y+z mod Modulus
	@param y FP number
	@param z FP number
 */
extern void FP_YYY_add(FP_YYY *x, FP_YYY *y, FP_YYY *z);
/**	@brief Modular subtraction of two FPs, mod Modulus
 *
	@param x FP number, on exit the modular difference = y-z mod Modulus
	@param y FP number
	@param z FP number
 */
extern void FP_YYY_sub(FP_YYY *x, FP_YYY *y, FP_YYY *z);
/**	@brief Modular division by 2 of an FP, mod Modulus
 *
	@param x FP number, on exit =y/2 mod Modulus
	@param y FP number
 */
extern void FP_YYY_div2(FP_YYY *x, FP_YYY *y);
/**	@brief Fast Modular exponentiation of an FP, to the power of a BIG, mod Modulus
 *
	@param x FP number, on exit  = y^z mod Modulus
	@param y FP number
	@param z BIG number exponent
 */
extern void FP_YYY_pow(FP_YYY *x, FP_YYY *y, BIG_XXX z);


/**	@brief Inverse square root precalculation
 *
	@param r FP number, on exit  = x^(p-2*e-1)/2^(e+1) mod Modulus
	@param x FP number
 */
extern void FP_YYY_invsqrt(FP_YYY *r,FP_YYY *x);

/**	@brief Fast Modular square root of a an FP, mod Modulus
 *
	@param x FP number, on exit  = sqrt(y) mod Modulus
	@param y FP number, the number whose square root is calculated
    @param h an optional precalculation
 */
extern void FP_YYY_sqrt(FP_YYY *x, FP_YYY *y, FP_YYY *h);

/**	@brief Modular negation of a an FP, mod Modulus
 *
	@param x FP number, on exit = -y mod Modulus
	@param y FP number
 */
extern void FP_YYY_neg(FP_YYY *x, FP_YYY *y);
/**	@brief Outputs an FP number to the console
 *
	Converts from residue form before output
	@param x an FP number
 */
extern void FP_YYY_output(FP_YYY *x);
/**	@brief Outputs an FP number to the console, in raw form
 *
	@param x a BIG number
 */
extern void FP_YYY_rawoutput(FP_YYY *x);
/**	@brief Reduces possibly unreduced FP mod Modulus
 *
	@param x FP number, on exit reduced mod Modulus
 */
extern void FP_YYY_reduce(FP_YYY *x);
/**	@brief normalizes FP
 *
	@param x FP number, on exit normalized
 */
extern void FP_YYY_norm(FP_YYY *x);
/**	@brief Tests for FP a quadratic residue mod Modulus
 *
	@param x FP number to be tested
    @param h an optional precalculation
	@return 1 if quadratic residue, else returns 0 if quadratic non-residue
 */
extern int FP_YYY_qr(FP_YYY *x,FP_YYY *h);
/**	@brief Modular inverse of a an FP, mod Modulus
 *
	@param x FP number, on exit = 1/y mod Modulus
	@param y FP number
 */
extern void FP_YYY_inv(FP_YYY *x, FP_YYY *y);




#endif
