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

use crate::arch::Chunk;
use crate::bls12383::big::NLEN;

// Base Bits= 58
pub const MODULUS: [Chunk; NLEN] = [
    0x2371D6485AAB0AB,
    0x30FCA6299214AF6,
    0x3801696124F47A8,
    0xB3CD969446B0C6,
    0x1FEA9284A0AD46,
    0x12ADBAD681B6B71,
    0x556556956,
];
pub const ROI: [Chunk; NLEN] = [
    0x2371D6485AAB0AA,
    0x30FCA6299214AF6,
    0x3801696124F47A8,
    0xB3CD969446B0C6,
    0x1FEA9284A0AD46,
    0x12ADBAD681B6B71,
    0x556556956,
];
pub const R2MODP: [Chunk; NLEN] = [
    0x80B6E0116907F4,
    0xCF53CF9752AC11,
    0x35D47189941C581,
    0x19D0835CB1E4D22,
    0x16963E90A0FC49B,
    0x367FB9DB3852312,
    0x4DFECE397,
];
pub const MCONST: Chunk = 0x1BC0571073435FD;
pub const FRA: [Chunk; NLEN] = [
    0x52D72D3311DAC1,
    0x24D203F99DCF806,
    0x344AE550D8C8A36,
    0x348FEE86A1A0959,
    0x2C11B52F10E4C6C,
    0x9FDA2F0CE2E7F0,
    0x22ACD5BF0,
];
pub const FRB: [Chunk; NLEN] = [
    0x1E446375298D5EA,
    0xC2AA22FF4452F0,
    0x3B684104C2BD72,
    0x16ACEAE2A2CA76D,
    0x15ECF3F939260D9,
    0x8B017E5B388380,
    0x32B880D66,
];

// Base Bits= 58

pub const CURVE_A: isize = 0;
pub const CURVE_COF_I: isize = 0;
pub const CURVE_COF: [Chunk; NLEN] = [
    0x80000010011FF,
    0x40,
    0x0,
    0x0,
    0x0,
    0x0,
    0x0,
];
pub const CURVE_B_I: isize = 15;
pub const CURVE_B: [Chunk; NLEN] = [0xF, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0];
pub const CURVE_ORDER: [Chunk; NLEN] = [
    0x32099EBFEBC0001,
    0x17C25684834E5CE,
    0x1C81698B381DE0,
    0x2003002E0270110,
    0x1002001,
    0x0,
    0x0,
];
pub const CURVE_GX: [Chunk; NLEN] = [
    0xC4773908734573,
    0x176FC20FD1DC11E,
    0x3AD84AF1E3445C5,
    0x1DAC207D0B0BE1E,
    0x52DDB050F31D9F,
    0x25E7B3938E0D7D0,
    0x41FCBA55B,
];
pub const CURVE_GY: [Chunk; NLEN] = [
    0x12D165E8003F224,
    0x1F527B21FE63F48,
    0xA94ADEB4D2DDE5,
    0x319AED912441D4C,
    0x1C31C46D99D0DAD,
    0x133ECC00092BA73,
    0x68F16727,
];

pub const CURVE_BNX: [Chunk; NLEN] = [0x8000001001200, 0x40, 0x0, 0x0, 0x0, 0x0, 0x0];
pub const CURVE_CRU: [Chunk; NLEN] = [
    0xC367502EAAC2A9,
    0x17DA068B7D974B7,
    0x2F4A34DEA341BC2,
    0xD36F75C5738948,
    0x6E94874605445,
    0x12ADBAD28116AD1,
    0x556556956,
];
pub const CURVE_PXA: [Chunk; NLEN] = [
    0x3CB3B62D7F2D86,
    0x3F6AD9E57474F85,
    0x1C90F562572EE81,
    0x3214B55C96F51FC,
    0x27CB1E746432501,
    0x1FB00FA301E6425,
    0x634D2240,
];
pub const CURVE_PXB: [Chunk; NLEN] = [
    0x3D9E41EC452DE15,
    0x12ACA355FF9837B,
    0xBA88E92D5D75B5,
    0x3B6741732277F66,
    0x3288361DD24F498,
    0x592EBCDE9DC5,
    0x300D78006,
];
pub const CURVE_PYA: [Chunk; NLEN] = [
    0x68F0BB9408CB41,
    0x27B793C83586597,
    0x3ACA913A2E75B4,
    0x359CF266CF9A25E,
    0x33FE6347B6E990E,
    0x34894D1F2527615,
    0x33792CF93,
];
pub const CURVE_PYB: [Chunk; NLEN] = [
    0x2D846437F479093,
    0x10F2C379889218E,
    0x32F449F7BC98B01,
    0x111ACFBEA3DEBC2,
    0x3D15A7AE001CE0D,
    0xB3631AC93B9EE9,
    0x20E5247DD,
];
pub const CURVE_W: [[Chunk; NLEN]; 2] = [
    [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
];
pub const CURVE_SB: [[[Chunk; NLEN]; 2]; 2] = [
    [
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    ],
    [
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    ],
];
pub const CURVE_WB: [[Chunk; NLEN]; 4] = [
    [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
];
pub const CURVE_BB: [[[Chunk; NLEN]; 4]; 4] = [
    [
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    ],
    [
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    ],
    [
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    ],
    [
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
        [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
    ],
];

pub const USE_GLV: bool = true;
pub const USE_GS_G2: bool = true;
pub const USE_GS_GT: bool = true;
pub const GT_STRONG: bool = true;
