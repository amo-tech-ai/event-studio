# Task 17: Week 3 - Settings Page
**Phase:** Week 3
**Priority:** 🟡 MEDIUM
**Time:** 8 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Tasks 01-06

---

## 🎯 Objective

Create Settings page for user profile, preferences, and system configuration.

---

## ✅ Success Criteria

- [ ] Settings page created
- [ ] Profile settings working
- [ ] Notification preferences
- [ ] Theme settings
- [ ] Account management
- [ ] Password change
- [ ] Data export

---

## 📋 Implementation

### 1. Create Settings Hooks (2 hours)

```typescript
// src/features/settings/hooks/useProfile.ts
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });
}

export function useProfileMutations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user!.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
```

---

### 2. Create Settings Page (4 hours)

```typescript
// src/pages/DashboardSettings.tsx
export function DashboardSettings() {
  const { data: profile } = useProfile();
  const updateProfile = useProfileMutations();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings profile={profile} onUpdate={updateProfile} />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

### 3. Create Setting Components (1 hour each)

```typescript
// Profile Settings
function ProfileSettings({ profile, onUpdate }) {
  const [formData, setFormData] = useState(profile);

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
          <Input
            label="Email"
            value={formData.email}
            disabled
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Card>
  );
}

// Notification Settings
function NotificationSettings() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-muted-foreground">
              Receive email about new orders
            </p>
          </div>
          <Switch />
        </div>
        {/* More notification options */}
      </div>
    </Card>
  );
}

// Appearance Settings
function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Label>Theme</Label>
        <RadioGroup value={theme} onValueChange={setTheme}>
          <RadioGroupItem value="light">Light</RadioGroupItem>
          <RadioGroupItem value="dark">Dark</RadioGroupItem>
          <RadioGroupItem value="system">System</RadioGroupItem>
        </RadioGroup>
      </div>
    </Card>
  );
}
```

---

### 4. Add Route (15 min)

```typescript
<Route path="/dashboard/settings" element={<DashboardSettings />} />
```

---

## ✅ Testing

- [ ] Settings page loads
- [ ] Profile updates save
- [ ] Theme changes work
- [ ] Notifications toggle
- [ ] All tabs functional

---

## 🎯 Next: Task 18 - Analytics Page

**Time Spent:** _____ hours
**Completed:** ___________________
