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

/* Fixed Data in ROM - Field and Curve parameters */


package org.miracl.core.NIST521;

public class ROM
{

// Base Bits= 60
	public static final long[] Modulus= {0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0x1FFFFFFFFFFL};
	public static final long[] ROI= {0xFFFFFFFFFFFFFFEL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0x1FFFFFFFFFFL};
	public static final long[] R2modp= {0x4000000000L,0x0L,0x0L,0x0L,0x0L,0x0L,0x0L,0x0L,0x0L};
	public static final long MConst= 0x1L;


	public static final int CURVE_Cof_I= 1;
	public static final long[] CURVE_Cof= {0x1L,0x0L,0x0L,0x0L,0x0L,0x0L,0x0L,0x0L,0x0L};
	public static final int CURVE_A= -3;
	public static final int CURVE_B_I= 0;
	public static final long[] CURVE_B= {0xF451FD46B503F00L,0x73DF883D2C34F1EL,0x2C0BD3BB1BF0735L,0x3951EC7E937B165L,0x9918EF109E15619L,0x5B99B315F3B8B48L,0xB68540EEA2DA72L,0x8E1C9A1F929A21AL,0x51953EB961L};
	public static final long[] CURVE_Order= {0xB6FB71E91386409L,0xB5C9B8899C47AEBL,0xC0148F709A5D03BL,0x8783BF2F966B7FCL,0xFFFFFFFFFFA5186L,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0xFFFFFFFFFFFFFFFL,0x1FFFFFFFFFFL};
	public static final long[] CURVE_Gx= {0x97E7E31C2E5BD66L,0x48B3C1856A429BFL,0xDC127A2FFA8DE33L,0x5E77EFE75928FE1L,0xF606B4D3DBAA14BL,0x39053FB521F828AL,0x62395B4429C6481L,0x404E9CD9E3ECB6L,0xC6858E06B7L};
	public static final long[] CURVE_Gy= {0x8BE94769FD16650L,0x3C7086A272C2408L,0xB9013FAD076135L,0x72995EF42640C55L,0xD17273E662C97EEL,0x49579B446817AFBL,0x42C7D1BD998F544L,0x9A3BC0045C8A5FBL,0x11839296A78L};

}

