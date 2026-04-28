import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { adminCrudService } from '../services/adminCrudService'

export function CompanyAddPage() {
  const [name, setName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [province, setProvince] = useState('')
  const [provinceCode, setProvinceCode] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await adminCrudService.createCompany({
      name,
      registration_number: registrationNumber,
      email,
      phone,
      website,
      province,
      province_code: provinceCode,
      address,
      country: 'RDC',
      status: 'active',
    })
    setMessage('Entreprise enregistree avec succes.')
    setName('')
    setRegistrationNumber('')
    setEmail('')
    setPhone('')
    setWebsite('')
    setProvince('')
    setProvinceCode('')
    setAddress('')
  }

  return (
    <section className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Ajouter une entreprise</h1>
          <p className="text-slate-600">Créez une nouvelle entreprise dans le système NCD.</p>
        </div>
        <BackLink to="/admin/companies" />
      </header>

      <article className="rounded-2xl border border-slate-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Nom de l'entreprise" required />
          <input value={registrationNumber} onChange={(event) => setRegistrationNumber(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Numéro d'enregistrement" />
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Email professionnel" />
          <input value={phone} onChange={(event) => setPhone(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Téléphone" />
          <input value={website} onChange={(event) => setWebsite(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2" placeholder="Site marchand (https://...)" />
          <input value={province} onChange={(event) => setProvince(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Province" />
          <input value={provinceCode} onChange={(event) => setProvinceCode(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3" placeholder="Code province (ex: CD-KN)" />
          <input value={address} onChange={(event) => setAddress(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2" placeholder="Adresse complète" />
          {message ? <p className="md:col-span-2 text-sm text-emerald-700">{message}</p> : null}
          <div className="md:col-span-2 flex justify-end gap-2">
            <Link to="/admin/companies">
              <Button variant="ghost" type="button">Annuler</Button>
            </Link>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </article>
    </section>
  )
}
