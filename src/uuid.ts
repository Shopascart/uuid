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
     * Generate a unique ID
     * @param {number} length - The length of the unique ID to be generated
     * @returns {string | number} - A unique ID
     */
    generate(length?: number): string | number;
    /**
     * A method that tests the accuracy of the unique ID algorithm
     * @returns {boolean} A boolean value that indicates whether the unique ID algorithm is accurate
     * @example
     * const uniqueID = new UniqueID();
     * const status = uniqueID.testUniqueID(); // true
     **/
    testUniqueID(): boolean;
    /**
     * A method that checks for duplicates in an array of unique IDs
     * @param {Array<number | string>} array - An array of unique IDs
     * @param {boolean} getCases - A boolean value that indicates whether to get the cases of duplicates
     * @returns {Object} An object that contains the status of the duplicates, the cases of duplicates and the duplicates
     * @example
     * const uniqueID = new UniqueID();
     * const array = [uniqueID.generate(), uniqueID.generate(), uniqueID.generate()];
     * const { status, cases, duplicates } = uniqueID.dupilcates(array); // { status: true, cases: [], duplicates: [] }
     **/
    dupilcates(array: Array<number | string>): {
        status: boolean,
        cases?: Array<string>,
        duplicates?: Array<number | string>
    };
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
    private readonly prefix: string;
    private readonly type: "string" | "number";
    private ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    constructor(prefix?: string, type?: "string" | "number") {
        this.prefix = prefix ? prefix : "";
        this.type = type ? type : "string";
    }
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
            return uniqueID;
        } else {
            const r = Math.floor(Math.random() * 1000000000);
            const result = `${r}${timestamp}${randomNum}${rnd}`;
            const uniqueID = Number(result.substring(0, length));
            return uniqueID;
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
        const unique = Array.from(new Set(array));
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
        // get the duplicates
        const c = array.filter((element, index) => array.indexOf(element) !== index)
        duplicates.push(...c);
        if (unique.length === array.length) {
            return {
                status: true,
                cases: cases,
                duplicates: duplicates
            }
        } else {
            return {
                status: false,
                cases: cases,
                duplicates: duplicates
            }
        }
    }

    public dupilcates(array: Array<number | string>): {
        status: boolean,
        cases?: Array<string>,
        duplicates?: Array<number | string>
    } {
        return this.checkUniqueIDDuplicates(array, true);
    }
}



export type IUUIDOptions = {
    type?: "string" | "number",
    prefix?: string,
    length?: number
}



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

export const UUID = (options?: IUUIDOptions): {
    /**
     *  The generate method generates a unique ID based on the options provided. If no options are provided, it generates a unique ID with a length of 16 characters and a type of "string"
     * @returns {string | number} A unique ID
     */
    generate: () => string | number
    /**
     * The test method tests the uniqueness of the unique ID algorithm by generating a large number of unique IDs and checking for duplicates
     * @returns {boolean} A boolean that indicates whether the list of generated unique IDs are unique or not
    */
    test(): boolean
    /**
     * The duplicates method checks for duplicates in an array of unique IDs
     * @param {Array<number | string>} array - An array of unique IDs
     * @returns {Object} An object that contains the status of the unique ID, the cases of duplicates and the duplicates
     */
    duplicates(array: Array<number | string>): {
        status: boolean,
        cases?: Array<string>,
        duplicates?: Array<number | string>
    }
} => {
    const methods = {
        generate: () => {
            const uniqueID = new UniqueID(options?.prefix ? options.prefix : "", options?.type ? options.type : "string");
            return uniqueID.generate(options?.length ? options.length : 16);
        },
        test: () => {
            const uniqueID = new UniqueID();
            return uniqueID.testUniqueID();
        },
        duplicates: (array: Array<number | string>) => {
            const uniqueID = new UniqueID();
            return uniqueID.dupilcates(array);
        }
    }
    return methods
}


export default UUID;