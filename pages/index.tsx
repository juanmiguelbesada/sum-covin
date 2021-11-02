import type { NextPage } from 'next'
import Head from 'next/head'
import React, {FormEvent, useState} from "react";

import { QrcodeIcon, PlusIcon } from '@heroicons/react/solid'

type ScanRead = {
  code: string;
  weight: number;
}

const processRead = (scanRead: string): ScanRead => {
  const EAN_13 = /^\d{7}(\d{5})\d$/
  const EAN_128 = /310(\d)(\d{6})/g

  let code;
  let weight;

  let m;

  if ((m = EAN_13.exec(scanRead)) !== null) {
    code = m[0];
    weight = Number(m[1]) / 1000;
  } else if ((m = EAN_128.exec(scanRead)) !== null) {
    code = m[0];
    weight = Number(m[2]) / (Math.pow(10,  Number(m[1])));
  } else {
    throw new Error(`Invalid code ${scanRead}`);
  }

  return { code, weight }
}

type NewScanProps = {
  onRead: (arg0: string) => void;
}
const NewScan: React.FunctionComponent<NewScanProps> = ({ onRead }) => {
  const [inputData, setInputData] = useState("");

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    onRead(inputData);
    setInputData("");
  }

  return (
      <form onSubmit={handleSubmit} className="mb-5">
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Código
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <QrcodeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                name="code"
                id="code"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
                placeholder="Código"
            />
          </div>
          <button
              type="submit"
              className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <PlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span>Añadir</span>
          </button>
        </div>
      </form>
  )
}

const Home: NextPage = () => {
  const [scanReads, setScanReads] = useState<ScanRead[]>([]);

  const addScan = (scanRead: string) => {
    const { code, weight } = processRead(scanRead)
    setScanReads([...scanReads, {code, weight}])
  }

  const removeRead = (scanRead: ScanRead) => {
    if (confirm("¿Estas seguro?")) {
      setScanReads(scanReads.filter(e => e !== scanRead));
    }
  }

  const reset = () => {
    if (confirm("¿Estas seguro?")) {
      setScanReads([]);
    }
  }

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <Head>
        <title>Suma COVIN</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-10">
        <div className="md:flex md:items-center md:justify-between mb-5">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">SUM COVIN</h2>
          </div>
        </div>

        <NewScan onRead={addScan} />

        <div className="flex flex-col mb-5">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
            <tr>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Num</th>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Código</th>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Peso</th>
              <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Acciones</th>
            </tr>
          </thead>
          <tbody>
          {scanReads.map((read, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index+1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{read.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${read.weight.toFixed(3)} Kgs`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-red-600 hover:text-danger-900" onClick={() => removeRead(read)}>
                    Eliminar
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <th colSpan={2} scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                <th colSpan={2} scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><strong>{scanReads.reduce((acc, read) => acc + read.weight, 0).toFixed(3)} Kgs</strong></th>
            </tr>
          </tfoot>
        </table>
              </div>
            </div>
          </div>
        </div>
        <button
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500" onClick={reset}>Limpiar</button>
      </main>
    </div>
  )
}

export default Home
