import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useGetGrowthLogs } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSafeActor } from '../../hooks/useSafeActor';
import { cmToInches, inchesToCm } from '../../utils/units';
import { sanitizeHeightInput, handleHeightKeyDown, formatHeightDisplay, parseHeightInput } from '../../utils/heightInput';
import { Info } from 'lucide-react';
import type { UserProfile } from '../../types/app-types';

export function ProfileInputsPanel() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorInitializing } = useSafeActor();
  const isAuthenticated = !!identity;
  const { data: profile } = useGetCallerUserProfile();
  const { data: growthLogs } = useGetGrowthLogs();
  const saveMutation = useSaveCallerUserProfile();

  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    currentHeight: '',
    fatherHeight: '',
    motherHeight: '',
  });
  const [saveError, setSaveError] = useState<string>('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.gender || '',
        age: profile.age.toString(),
        gender: profile.isMale ? 'male' : 'female',
        currentHeight: profile.currentHeightCm?.toString() || '',
        fatherHeight: profile.fatherHeightCm.toString(),
        motherHeight: profile.motherHeightCm.toString(),
      });
    }
  }, [profile]);

  useEffect(() => {
    if (growthLogs && growthLogs.length > 0 && !formData.currentHeight) {
      const latest = growthLogs[growthLogs.length - 1];
      setFormData(prev => ({ ...prev, currentHeight: Math.round(latest.heightCm).toString() }));
    }
  }, [growthLogs, formData.currentHeight]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    
    const profileData: UserProfile = {
      gender: formData.name,
      age: parseFloat(formData.age),
      isMale: formData.gender === 'male',
      currentHeightCm: formData.currentHeight ? parseHeightInput(formData.currentHeight, 'cm') : undefined,
      fatherHeightCm: parseHeightInput(formData.fatherHeight, 'cm'),
      motherHeightCm: parseHeightInput(formData.motherHeight, 'cm'),
    };

    try {
      await saveMutation.mutateAsync(profileData);
    } catch (error: any) {
      setSaveError(error.message || 'Failed to save profile. Please try again.');
    }
  };

  const formatHeight = (cm: string) => {
    if (!cm) return '';
    const value = parseFloat(cm);
    if (unit === 'cm') {
      return Math.round(value).toString();
    }
    return cmToInches(value).toFixed(1);
  };

  const parseHeight = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return unit === 'cm' ? Math.round(num).toString() : Math.round(inchesToCm(num)).toString();
  };

  const handleHeightChange = (field: 'currentHeight' | 'fatherHeight' | 'motherHeight', value: string) => {
    const sanitized = sanitizeHeightInput(value, unit);
    const parsed = parseHeight(sanitized);
    setFormData({ ...formData, [field]: parsed });
  };

  const isSubmitDisabled = saveMutation.isPending || !isAuthenticated || actorInitializing || !actor;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile & Measurements</CardTitle>
        <CardDescription>
          Enter your information for accurate height predictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isAuthenticated && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please log in to save your profile and track your growth over time.
            </AlertDescription>
          </Alert>
        )}

        {actorInitializing && isAuthenticated && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Connecting... Please wait a moment.
            </AlertDescription>
          </Alert>
        )}

        {saveError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-end mb-4">
            <Select value={unit} onValueChange={(v) => setUnit(v as 'cm' | 'in')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">Metric (cm)</SelectItem>
                <SelectItem value="in">Imperial (in)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                step="0.1"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Your age"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentHeight">Current Height ({unit})</Label>
              <Input
                id="currentHeight"
                type="number"
                step={unit === 'cm' ? '1' : '0.1'}
                value={formData.currentHeight ? formatHeight(formData.currentHeight) : ''}
                onChange={(e) => handleHeightChange('currentHeight', e.target.value)}
                onKeyDown={(e) => handleHeightKeyDown(e, unit)}
                placeholder={`Your height in ${unit}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fatherHeight">Father's Height ({unit})</Label>
              <Input
                id="fatherHeight"
                type="number"
                step={unit === 'cm' ? '1' : '0.1'}
                value={formData.fatherHeight ? formatHeight(formData.fatherHeight) : ''}
                onChange={(e) => handleHeightChange('fatherHeight', e.target.value)}
                onKeyDown={(e) => handleHeightKeyDown(e, unit)}
                placeholder={`Father's height in ${unit}`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motherHeight">Mother's Height ({unit})</Label>
              <Input
                id="motherHeight"
                type="number"
                step={unit === 'cm' ? '1' : '0.1'}
                value={formData.motherHeight ? formatHeight(formData.motherHeight) : ''}
                onChange={(e) => handleHeightChange('motherHeight', e.target.value)}
                onKeyDown={(e) => handleHeightKeyDown(e, unit)}
                placeholder={`Mother's height in ${unit}`}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitDisabled}>
            {actorInitializing ? 'Connecting...' : saveMutation.isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
