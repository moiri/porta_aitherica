import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TRootStore } from '../store/store';
import { Alert, Card, Table, Row, Col } from 'react-bootstrap';

export const Kampf: React.FC = () => {
    const idx = 0;
    const held = useSelector((store: TRootStore) => {
        if (idx !== undefined) {
            return store.helden[Number(idx)];
        }
    });
    if (!held) {
        return <Alert variant="dark">Kein Held</Alert>
    }
//    const at = Number(held.kampf.kampfwerte.find(wert => wert['@_name'] === "Dolche")?.attacke['@_value']) ?? 0;
//    const pa = Number(held.kampf.kampfwerte.find(wert => wert['@_name'] === "Dolche")?.parade['@_value']) ?? 0;
    const a = { at: 18, pa: 18, rs: 1, tpMin: 6, tpMax: 11, le: 30 };
    const b = { at: 11, pa: 11, rs: 3, tpMin: 5, tpMax: 10, le: 40 };
    const dice = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    const getQ = (at: number, die: number) => {
        const q = at - die;
        if (q > 0) {
            return Math.ceil(q/2);
        }
        return Math.ceil(q/2);
    }
    const getPHit = (at: number, pa: number) => {
        let possible = 0;
        for (let i = 1; i <= 20; i++) {
            for (let j = 1; j <= 20; j++) {
                const q = getQ(at, i)
                if (i === 20) {
                    continue;
                }
                if (i === 1 && j !== 1) {
                    possible++;
                    continue;
                }
                if (j === 1) {
                    continue;
                }
                if (j === 20) {
                    possible++;
                    continue;
                }
                if (j > pa - q) {
                    possible++;
                    continue;
                }
            }
        }
        return possible / 400;
    }
    const getPTp = (rs: number, tpMin: number, tpMax: number) => {
        if (tpMax <= rs) {
            return 0;
        }
        if (tpMin > rs) {
            return 1;
        }
        return (tpMax - rs)/(tpMax - tpMin + 1);
    }
    const getETp = (rs: number, tpMin: number, tpMax: number) => {
        if (rs <= tpMin) {
            return (tpMax + tpMin) / 2 - rs;
        }
        if (rs > tpMax) {
            return 0;
        }
        return (tpMax - rs)/2;
    }
    const getTurns = (le: number, at:number, pa: number, rs: number, tpMin: number, tpMax: number) => {
        const pTp = getPTp(rs, tpMin, tpMax);
        const eTp = getETp(rs, tpMin, tpMax);
        const pHit = getPHit(at, pa);
        return le / (pTp * eTp * pHit);
    }
    const getPWin = (t1: number, t2: number) => {
        return t2 / (t1 + t2)
    }

    return (
        <>
            <div>
                {getPHit(a.at, b.pa)}/{getPHit(b.at, a.pa)}
            </div>
            <div>
                {getPTp(b.rs, a.tpMin, a.tpMax)}/{getPTp(a.rs, b.tpMin, b.tpMax)}
            </div>
            <div>
                {getETp(b.rs, a.tpMin, a.tpMax)}/{getETp(a.rs, b.tpMin, b.tpMax)}
            </div>
            <div>
                {getTurns(a.le, a.at, b.pa, b.rs, a.tpMin, a.tpMax)}/{getTurns(b.le, b.at, a.pa, a.rs, b.tpMin, b.tpMax)}
            </div>
            <div>
                {getPWin(getTurns(a.le, a.at, b.pa, b.rs, a.tpMin, a.tpMax), getTurns(b.le, b.at, a.pa, a.rs, b.tpMin, b.tpMax))}/
                {getPWin(getTurns(b.le, b.at, a.pa, a.rs, b.tpMin, b.tpMax), getTurns(a.le, a.at, b.pa, b.rs, a.tpMin, a.tpMax))}
            </div>
        </>
    );
}
