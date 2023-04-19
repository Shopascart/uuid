import crypto from 'crypto';

/**
 * Generate a random byte array
 * @param size - The size of the random bits to be generated
 * @returns A random byte array
 */
export const RandomBits = (size: number): Uint8Array => {
    return crypto.randomBytes(size);
}

/**
* Generate a random hex string
* @param size - The size of the random hex string to be generated
* @returns A random hex string
*/
export const HexRandomBytes = (size: number): string => {
    return crypto.randomBytes(size).toString('hex');
}


export interface IUniqueID {
    /**
     * Prefix to be added to the unique ID
    */
    prefix?: string;
    /**
     * The type of unique ID to be generated. It can be either "string" or "number"
     * @default "string"    
     * */
    type?: "string" | "number";
    /**
     * Generate a unique ID
     * @param {number} length - The length of the unique ID to be generated
     * @returns {string | number} - A unique ID
     */
    generate(length?: number): IUniqueID['type'] extends "string" ? string : number
    generate(length?: number): IUniqueID['type'] extends "number" ? number : string
    generate(length?: number): string | number;
    /**
     * A method that tests the accuracy of the unique ID algorithm
     * @returns {boolean} A boolean value that indicates whether the unique ID algorithm is accurate
     * @example
     * const uniqueID = new UniqueID();
     * const status = uniqueID.testUniqueID(); // true
     **/
    testUniqueID(): boolean;
}

/**
 * The UniqueID class provides a set of methods for generating and testing unique IDs. It can be used to generate unique IDs of type string or number and can also be used to test the accuracy of the unique ID algorithm
 * @description A class that generates unique IDs
 * @param {string} prefix - A prefix to be added to the unique ID
 * @param {string} type - The type of unique ID to be generated. It can be either "string" or "number"
 * @returns {string | number} - A unique ID
 * @example
 * const uniqueID = new UniqueID(prefix, type) // prefix_a12dkqwe14972
 */

export class UniqueID implements IUniqueID {
    readonly prefix: string;
    readonly type: "string" | "number";
    private ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    constructor(prefix?: string, type?: "string" | "number") {
        this.prefix = prefix ? prefix : "";
        this.type = type ? type : "string";
    }
    generate(length?: number): IUniqueID['type'] extends "string" ? string : number
    generate(length?: number): IUniqueID['type'] extends "number" ? number : string
    public generate(length?: number): string | number {
        const rnd = RandomBits(1)[0];
        const timestamp = new Date().getTime();
        const val = new Array(length ? length : 8);
        const charsLength = this.ALPHANUMERIC.length;
        const randomNum = Math.floor((Math.random() * 100000000) * 0x100000000);
        const uuid = HexRandomBytes(16);
        for (let i = 0; i < val.length; i++) {
            val[i] = this.ALPHANUMERIC.charAt(Math.floor(Math.random() * charsLength));
        }
        if (this.type === "string") {
            const unique = this.prefix ? `${this.prefix}_${uuid}${timestamp}${randomNum}${rnd}` : `${uuid}${timestamp}${randomNum}${rnd}`;
            const uniqueID = unique.substring(0, length ? length : 16);
            return uniqueID as string;
        } else {
            const r = Math.floor(Math.random() * 1000000000);
            const result = `${r}${timestamp}${randomNum}${rnd}`;
            const uniqueID = Number(result.substring(0, length));
            return uniqueID as number;
        }
    }
    public testUniqueID(): boolean {
        const ids = new Set<string | number>();
        const length = 100000;
        for (let i = 0; i < length; i++) {
            const id = this.generate();
            if (ids.has(id)) {
                return false;
            }
            ids.add(id);
        }
        return true;
    }

    private checkUniqueIDDuplicates(array: Array<number | string>, getCases?: boolean): {
        status: boolean,
        cases?: Array<string>,
        duplicates?: Array<number | string>
    } {
        const cases = [];
        const duplicates = [];
        if (getCases) {
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                const index = array.indexOf(element);
                if (index !== i) {
                    cases.push(`Case ${i} and ${index} are duplicates`);
                }
            }
        }
        let sorted_arr = array.slice().sort();
        for (let i = 0; i < sorted_arr.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                duplicates.push(sorted_arr[i]);
            }
        }
        if (duplicates.length === 0) {
            return {
                status: false,
                cases: cases,
                duplicates: duplicates
            }
        } else {
            return {
                status: true,
                cases: cases,
                duplicates: duplicates
            }
        }
    }

    private duplicates(array: Array<number | string>): {
        status: boolean,
        cases?: Array<string>,
        duplicates?: Array<number | string>
    } {
        return this.checkUniqueIDDuplicates(array, true);
    }
}



export type TUUIDOptions = {
    type?: "string" | "number",
    prefix?: string,
    length?: number
}


type TString = {
    generate(): string,
    test(): boolean,
}
type TNumber = {
    generate(): number,
    test(): boolean,
}

type TUUID = TString | TNumber


/**
 * A wrapper function for the UniqueID class that provides a set of methods for generating and testing unique IDs
 * @description A function that generates unique IDs
 * @param options - An object that contains the type of unique ID to be generated, the prefix to be added to the unique ID and the length of the unique ID.
 ** Note: If the type of unique ID is "number", the prefix will be ignored and will return a number with the specified length
  * @example
  * const id = UUID().generate();
  * const id = UUID({ type: "number", length: 14 }).generate();
  * const id = UUID({ type: "string", prefix: "prefix", length: 10 }).generate();
 * @returns {Object} An object that contains the methods for generating unique IDs, testing unique IDs and checking for duplicates
 */
function UUID(options: TUUIDOptions & { type: "string" }): TString
function UUID(options: TUUIDOptions & { type: "number" }): TNumber
function UUID(): TString
function UUID(options?: TUUIDOptions): TUUID
function UUID(options?: TUUIDOptions): TUUID {
    const uniqueID = new UniqueID(options?.prefix, options?.type);
    return {
        /**
         * The generate method generates a unique ID based on the options provided. If no options are provided, it generates a unique ID with a length of 16    characters and a type of "string"
         * @returns {string | number} A unique ID
        */
        generate: () => uniqueID.generate(options?.length),
        /**
        * The test method tests the uniqueness of the unique ID algorithm by generating a large number of unique IDs and checking for duplicates
        * @returns {boolean} A boolean that indicates whether the list of generated unique IDs are unique or not
        */
        test: () => uniqueID.testUniqueID(),
    }
}

export default UUID;