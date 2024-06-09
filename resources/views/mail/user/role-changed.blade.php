<x-mail::message>
    Xin chào, {{$user->name}}

    @if($user->is_admin)
        Tài khoản của bạn đã được cấp quyền quản trị. Bạn có thể tạo tài khoản và chặn người dùng.
    @else
        Tài khoản của bạn đã bị thu hồi quyền quản trị. Tài khoản của bạn giờ đây là tài khoản thường.
    @endif

    Cảm ơn, <br>
    {{config('app.name')}}
</x-mail::message>
