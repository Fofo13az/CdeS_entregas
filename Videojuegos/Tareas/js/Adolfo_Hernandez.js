/*
 * Actividad en clase: Javascript
 * Adolfo Hernández Sánchez
 * A0182496
 */

"use strict";

function firstNonRepeating(str){

    const count = {};

    for (const char of str) {
        count[char] = (count[char] || 0) + 1;
    }

    for (const char of str) {
        if (count[char] === 1){ 
            return char;
        }
    }

}

function bubbleSort(list){
    for (let i = 0; i<list.length; i++){
            for (let j = 0; j<list.length-1; j++){
                if (list[j] > list[j+1]){
                    let temp = list[j];
                    list[j] = list[j+1];
                    list[j+1] = temp;
                }
            }
    }

    return list;
}

function invertArray(array){
    let newArray = [];
    for (let i = array.length-1; i>=0; i--){
        newArray.push(array[i]);
    }

    return newArray;
}

function invertArrayInplace(array){
    let i = 0;
    let j = array.length-1;

    while (i < j) {
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;

        i+=1;
        j-=1;
    }

    return array;
}



function capitalize(sentence){
    let string = "";
    let cap = true;

    for (let char of sentence){
        if (char === " "){
            cap = true;
            string += char;
        }
        else if (cap == true){
            string += char.toUpperCase();
            cap = false;
        }
        else{
            string += char;
        }
    }

    return string;
}

function mcd(num1, num2){
    if (num1 > num2){
        if (num1%num2 == 0){
            return num2;
        }
        else{
            return mcd(num2, num1%num2);
        }
    }
    else{
        if (num1 == 0){
            return 0;
        }
        if (num2%num1 == 0){
            return num1;
        }
        else{
            return mcd(num1, num2%num1);
        }
    }
}

function hackerSpeak(sentence){
    let hackspeak = "";
    for (let char of sentence){
        if (char.toLowerCase() === 'a'){
            char = '4';
            hackspeak += char;
        }
        else if (char.toLowerCase() === 's'){
            char = '5';
            hackspeak += char;
        }
        else if (char.toLowerCase() === 'e'){
            char = '3';
            hackspeak += char;
        }
        else if (char.toLowerCase() === 'o'){
            char = '0';
            hackspeak += char;
        }
        else if (char.toLowerCase() === 'i'){
            char = '1';
            hackspeak += char;
        }
        else{
            hackspeak += char;
        }
    }

    return hackspeak;
}

function factorize(num){
    let factores = [];
    for (let i = 1; i<=num; i++){
        if (num%i === 0){
            factores.push(i);
        }
    }
    return factores;
}

function deduplicate(array){
    let newList = [];
    for (let i = 0; i<array.length; i++){
        if (!newList.includes(array[i])){
            newList.push(array[i]);
        }
    }

    return newList;
}

function findShortestString(list){
    if (list == ''){
        return 0;
    }

    let shortest = list[0].length;

    for (let i = 0; i<list.length; i++){
        if (list[i].length < shortest){
            shortest = list[i].length;
        }
    }

    return shortest;
}

function isPalindrome(sentence){
    let right_to_left = "";
    

    for (let i = sentence.length-1; i>=0; i--){
        right_to_left += sentence[i];
    }

    if (sentence.toLowerCase() === right_to_left.toLowerCase()){
        return true;
    }
    else{
        return false;
    }
}

function sortStrings(list){
    for (let i = 0; i<list.length; i++){
            for (let j = 0; j<list.length-1; j++){
                if (list[j].localeCompare(list[j + 1]) > 0){
                    let temp = list[j];
                    list[j] = list[j+1];
                    list[j+1] = temp;
                }
                
            }
    }

    return list;
}

function stats(nums){
    let promedio_moda = [];


    let sum = 0;
    for (let i = 0; i<nums.length; i++){
        sum += nums[i];
    }
    if (sum === 0){
        promedio_moda.push(0);
    }
    else{
        promedio_moda.push(sum/nums.length);
    }

    const count = {};
    for (let i = 0; i<nums.length; i++) {
        count[nums[i]] = (count[nums[i]] || 0) + 1;
    }
    let moda = null;
    let counter = 0;
    for (const num in count){
        if (count[num] > counter) {
            moda = num;
            counter = count[num];
        }
    }
    if (moda === null){
        promedio_moda.push(0);
    }
    else{
        promedio_moda.push(Number(moda));
    }

    return promedio_moda;

}

function popularString(list){

    const count = {};
    for (const string of list) {
        count[string] = (count[string] || 0) + 1;
    }

    let popular = null;
    let counter = 0;
    for (const string in count){
        if (count[string] > counter) {
            popular = string;
            counter = count[string];
        }
    }
    if (popular === null){
        return '';
    }
    else{
        return popular;
    }
}

function isPowerOf2(num){
    while (num > 1) {
        if (num % 2 !== 0) {
            return false;
        }
        num /= 2;
    }

    return true;
}

function sortDescending(nums) {
    return nums.slice().sort((a, b) => b - a);
}



export {
    firstNonRepeating,
    bubbleSort,
    invertArray,
    invertArrayInplace,
    capitalize,
    mcd,
    hackerSpeak,
    factorize,
    deduplicate,
    findShortestString,
    isPalindrome,
    sortStrings,
    stats,
    popularString,
    isPowerOf2,
    sortDescending,
};
