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

/* Timing ECC Functions */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ecp_XXX.h>
#include <randapi.h>

#define HAVE_ECCX08

#ifdef HAVE_ECCX08
#include <ArduinoECCX08.h>
#endif

using namespace core;
using namespace XXX;
using namespace XXX_BIG;

csprng RNG;                // Crypto Strong RNG
ECP G;
BIG r;
int count;

void setup()
{
    int i;
    ECP P;
    Serial.begin(115200);
    while (!Serial);
#ifdef HAVE_ECCX08
    if (!ECCX08.begin()) {
        Serial.println("Failed to communicate with ECC508/ECC608!");
        while (1);
    }
#endif
    char raw[100];
    octet RAW = {0, sizeof(raw), raw};
    RAW.len = 100;
#ifdef HAVE_ECCX08
    for (i = 0; i < 100; i++) RAW.val[i] = ECCX08.random(256);
#else
    for (i = 0; i < 100; i++) RAW.val[i] = i + 1;
#endif
    CREATE_CSPRNG(&RNG, &RAW);  // initialise strong RNG

    Serial.println("Testing/Timing XXX ECC");

#if CURVETYPE_XXX==WEIERSTRASS
    Serial.println("Weierstrass parameterization");
#endif
#if CURVETYPE_XXX==EDWARDS
    Serial.println("Edwards parameterization");
#endif
#if CURVETYPE_XXX==MONTGOMERY
    Serial.println("Montgomery parameterization");
#endif

#if MODTYPE_YYY == PSEUDO_MERSENNE
    Serial.println("Pseudo-Mersenne Modulus");
#endif

#if MODTYPE_YYY == GENERALISED_MERSENNE
    Serial.println("Generalised-Mersenne Modulus");
#endif

#if MODTYPE_YYY == MONTGOMERY_FRIENDLY
    Serial.println("Montgomery Friendly Modulus");
#endif

#if MODTYPE_YYY == NOT_SPECIAL
    Serial.println("Not special Modulus");
#endif

    ECP_generator(&G);
    BIG_rcopy(r, CURVE_Order);
    ECP_copy(&P, &G);
    ECP_mul(&P, r);

    if (!ECP_isinf(&P))
    {
        Serial.println("FAILURE - rG!=O");
        while (1)  delay(1000);

    }
    count = 0;
}

void loop()
{
    ECP P;
    BIG s;

    BIG_randtrunc(s, r, 2 * CURVE_SECURITY_XXX, &RNG);
    ECP_copy(&P, &G);
    Serial.println("Start ECC point multiplication");

    ECP_mul(&P, s);

    Serial.println("Stop ECC point multiplication");
    count++;
    if (count > 6)
    {
        while (1) delay(1000);
    }
}

