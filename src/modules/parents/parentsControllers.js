import express from 'express';
import * as parentsService from '#modules/parents/parentsService.js';


export const createParent = async (req, res, next) => {
    try {
        const parent = await parentsService.createParent(req.body);
        res.status(201).json(parent);
    } catch (error) {    
            next(error);
    }
}
export const bulkCreateParents = async (req, res, next) => {
    try {
        const results = await parentsService.bulkCreateParents(req.body);
        res.status(201).json(results);
    } catch (error) {
        next(error);
    }
}

export const getAllParents = async (req, res, next) => {
    try {
        const parents = await parentsService.getAllParents();
        res.json(parents);
    } catch (error) {
        next(error);
    }
}

export const getParentsById = async (req, res, next) => {
    try {
        const parent = await parentsService.getParentsById(req.params.id);
        res.json(parent);
    } catch (error) {
        next(error);
    }
}

export const updateParent = async (req, res, next) => {
    try {
        const parent = await parentsService.updateParent(req.params.id, req.body);
        res.json(parent);
    } catch (error) {
        next(error);
    }
}

export const deleteParent = async (req, res, next) => {
    try {
        const result = await parentsService.deleteParent(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
}
