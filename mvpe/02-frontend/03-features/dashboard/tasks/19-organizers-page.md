# Task 19: Week 3 - Organizers (CRM) Page
**Phase:** Week 3
**Priority:** 🔴 HIGH
**Time:** 8 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Task 02 (CRM sample data)

---

## 🎯 Objective

Create Organizers/CRM page to manage companies, contacts, and relationships.

---

## ✅ Success Criteria

- [ ] Organizers page created
- [ ] Companies list displays
- [ ] Contacts list displays
- [ ] Add/edit companies
- [ ] Add/edit contacts
- [ ] Link contacts to companies
- [ ] Interaction tracking

---

## 📋 Implementation

### 1. Create CRM Hooks (3 hours)

```typescript
// src/features/crm/hooks/useCompanies.ts
export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          contacts:contacts(count)
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
  });
}

export function useContacts(companyId?: string) {
  return useQuery({
    queryKey: ['contacts', companyId],
    queryFn: async () => {
      let query = supabase
        .from('contacts')
        .select(`
          *,
          company:companies(name)
        `)
        .order('full_name');

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCompanyMutations() {
  const queryClient = useQueryClient();

  return {
    create: useMutation({
      mutationFn: async (company: Partial<Company>) => {
        const { data, error } = await supabase
          .from('companies')
          .insert(company)
          .select()
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      },
    }),
  };
}
```

---

### 2. Create Organizers Page (3 hours)

```typescript
// src/pages/DashboardOrganizers.tsx
export function DashboardOrganizers() {
  const { data: companies, isLoading } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const { data: contacts } = useContacts(selectedCompany || undefined);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Organizers & Contacts</h1>
        <div className="flex gap-2">
          <Button onClick={() => setCompanyDialog(true)}>
            Add Company
          </Button>
          <Button onClick={() => setContactDialog(true)}>
            Add Contact
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Companies List */}
        <Card className="p-6 md:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Companies</h3>
          <div className="space-y-2">
            {companies?.map(company => (
              <div
                key={company.id}
                className={cn(
                  "p-3 rounded cursor-pointer hover:bg-accent",
                  selectedCompany === company.id && "bg-accent"
                )}
                onClick={() => setSelectedCompany(company.id)}
              >
                <p className="font-medium">{company.name}</p>
                <p className="text-sm text-muted-foreground">
                  {company.contacts?.[0]?.count || 0} contacts
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Contacts List */}
        <Card className="p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">
            {selectedCompany ? 'Company Contacts' : 'All Contacts'}
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts?.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.full_name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.company?.name}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
```

---

### 3. Create Company/Contact Dialogs (2 hours)

```typescript
// Company Dialog
function CompanyDialog({ open, onClose, company }) {
  const createCompany = useCompanyMutations().create;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{company ? 'Edit' : 'Add'} Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input name="name" label="Company Name" required />
          <Input name="email" label="Email" type="email" />
          <Input name="phone" label="Phone" />
          <Input name="website" label="Website" />
          <Select name="industry" label="Industry">
            <option>Technology</option>
            <option>Entertainment</option>
            <option>Sports</option>
          </Select>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## ✅ Testing

- [ ] Page loads with companies
- [ ] Shows 5+ companies (from sample data)
- [ ] Click company shows contacts
- [ ] Add company works
- [ ] Add contact works
- [ ] Edit/delete works

---

## 🎯 Next: Task 20 - Venues Page

**Time Spent:** _____ hours
**Completed:** ___________________
